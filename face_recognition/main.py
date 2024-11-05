import cv2
import numpy as np
import time
from datetime import datetime, timedelta
from imutils.video import VideoStream
import os
import face_recognition
import requests
import sys
from dotenv import load_dotenv

load_dotenv()

# Firebase configuration
FIREBASE_API_KEY = os.getenv('FIREBASE_API_KEY')
FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')
FIREBASE_COLLECTION = os.getenv('FIREBASE_COLLECTION')

GRACE_PERIOD_MINUTES = 15

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
known_faces_dir = os.path.join(current_dir, "known_faces")

# Load the pre-trained face detection model
prototxt_path = os.path.join(current_dir, "deploy.prototxt.txt")
model_path = os.path.join(current_dir, "res10_300x300_ssd_iter_140000.caffemodel")

# Check if files exist
if not os.path.exists(prototxt_path):
    raise FileNotFoundError(f"Cannot find deploy.prototxt.txt at {prototxt_path}")
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Cannot find res10_300x300_ssd_iter_140000.caffemodel at {model_path}")

# Load the model
try:
    net = cv2.dnn.readNetFromCaffe(prototxt_path, model_path)
except cv2.error as e:
    print(f"Error loading face detection model: {str(e)}")
    sys.exit(1)


# Firebase Firestore API endpoint
FIRESTORE_URL = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents"


# Load known faces from the "known_faces" directory
def load_known_faces(known_faces_dir=known_faces_dir):
    if not os.path.exists(known_faces_dir):
        raise FileNotFoundError(f"Cannot find known_faces directory at {known_faces_dir}")
    
    known_face_encodings = []
    known_face_names = []

    allowed_extensions = ['.jpg', '.jpeg', '.png', '.bmp']

    for image_name in os.listdir(known_faces_dir):
        if any(image_name.lower().endswith(ext) for ext in allowed_extensions):
            image_path = os.path.join(known_faces_dir, image_name)
            try:
                img = face_recognition.load_image_file(image_path)
                img_encodings = face_recognition.face_encodings(img)

                if len(img_encodings) > 0:
                    img_encoding = img_encodings[0]
                    known_face_encodings.append(img_encoding)
                    known_face_names.append(os.path.splitext(image_name)[0])
                else:
                    print(f"Warning: No face found in {image_name}. Skipping this image.")
            except Exception as e:
                print(f"Error processing {image_name}: {str(e)}")
        else:
            print(f"Skipping non-image file: {image_name}")

    return known_face_encodings, known_face_names


def mark_attendance(name, event_id, start_datetime):
    timestamp = datetime.now()
    timestamp_str = timestamp.strftime('%Y-%m-%d %H:%M:%S')

    # Set time range for on-time and late attendance
    on_time_start = start_datetime - timedelta(minutes=GRACE_PERIOD_MINUTES)
    on_time_end = start_datetime + timedelta(minutes=GRACE_PERIOD_MINUTES)

    # Determine attendance status based on date and time comparison
    if on_time_start <= timestamp <= on_time_end:
        attendance_status = "attended"
    elif timestamp > on_time_end:
        attendance_status = "late"

    # Document fields to update
    data = {
        "fields": {
            "status": {"stringValue": attendance_status},
            "time": {"stringValue": timestamp_str}
        }
    }

    # Firestore document URL for the specific path
    doc_url = f"{FIRESTORE_URL}/events/{event_id}/attendees/{name}"

    try:
        # Update the document (PATCH request)
        response = requests.patch(f"{doc_url}?key={FIREBASE_API_KEY}&updateMask.fieldPaths=status&updateMask.fieldPaths=time", json=data)
        if response.status_code == 200:
            print(f"Updated attendance for {name} in event {event_id} with status: {attendance_status}, time: {timestamp_str}")
        else:
            print(f"Error updating attendance: {response.status_code} - {response.content}")

    except requests.RequestException as e:
        print(f"Error connecting to Firestore: {str(e)}")


# Countdown Timer
def display_countdown_timer(frame, start_datetime, grace_period_minutes):
    current_time = datetime.now()
    time_remaining = start_datetime + timedelta(minutes=grace_period_minutes) - current_time
    seconds_remaining = max(0, int(time_remaining.total_seconds()))  # Ensure non-negative value

    # Format the time as MM:SS
    minutes = seconds_remaining // 60
    seconds = seconds_remaining % 60
    timer_text = f"Time Remaining: {minutes:02}:{seconds:02}"

    # Display the countdown timer
    cv2.putText(frame, timer_text, (10, frame.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)


# Attendance Status Display Board
def display_attendance_status_board(frame, marked_faces):
    x, y = 20, 40  # Starting position
    cv2.putText(frame, "Attendance Status", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    for i, (name, is_late) in enumerate(marked_faces.items()):
        status_text = "LATE" if is_late else "ON TIME"
        color = (0, 255, 255) if is_late else (0, 255, 0)  # Yellow for late, green for on time
        cv2.putText(frame, f"{name}: {status_text}", (x, y + (i + 1) * 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)


def get_attendance_status(name, event_id):
    # Firestore document URL for the specific path
    doc_url = f"{FIRESTORE_URL}/events/{event_id}/attendees/{name}"
    event_url = f"{FIRESTORE_URL}/events/{event_id}"

    try:
        # Make a GET request to Firestore to fetch the attendee's data and event data
        response = requests.get(f"{doc_url}?key={FIREBASE_API_KEY}")
        event_response = requests.get(f"{event_url}?key={FIREBASE_API_KEY}")
        
        if response.status_code == 200 and event_response.status_code == 200:
            document = response.json()
            event_document = event_response.json()

            # Get attendance status
            status = document['fields'].get('status', {}).get('stringValue', "pending")

            # Retrieve the date and start time separately
            date_str = event_document['fields']['date']['stringValue']
            start_time_str = event_document['fields']['startTime']['stringValue']

            # Combine the date and start time into a single datetime object
            start_datetime = datetime.strptime(f"{date_str} {start_time_str}", '%Y-%m-%d %H:%M')

            return status, start_datetime
        else:
            print(f"Error retrieving data for {name}: {response.status_code} or event: {event_response.status_code}")
            return None, None

    except requests.RequestException as e:
        print(f"Error connecting to Firestore: {str(e)}")
        return None, None


# Updated mark_attendance_if_pending to mark late attendees based on on_time_start + GRACE_PERIOD_MINUTES
def mark_attendance_if_pending(name, event_id):
    status, start_datetime = get_attendance_status(name, event_id)
    
    if status == "pending":
        print(f"{name} has 'pending' status. Marking attendance.")
        mark_attendance(name, event_id, start_datetime)

        # Calculate the on-time end based on the grace period from the event's start time
        on_time_end = start_datetime + timedelta(minutes=GRACE_PERIOD_MINUTES)
        current_time = datetime.now()
        is_late = current_time > on_time_end  # True if current time is beyond the grace period
        return is_late
    elif status is None:
        print(f"Could not retrieve status for {name}. Skipping.")
    else:
        print(f"{name} already marked as {status}. Skipping.")
    
    return False  # Not late if already marked



def main(event_id):
    # Initialize the video stream and allow the camera sensor
    print(f"Starting video stream for event: {event_id}")
    try:
        vs = VideoStream(src=0).start()
        time.sleep(2.0)
    except Exception as e:
        print(f"Error starting video stream: {str(e)}")
        sys.exit(1)

    # Load known faces for recognition
    try:
        known_face_encodings, known_face_names = load_known_faces()
    except Exception as e:
        print(f"Error loading known faces: {str(e)}")
        vs.stop()
        sys.exit(1)

    # Initialize a dictionary to store marked faces
    marked_faces = {}
    status, start_datetime = get_attendance_status(known_face_names[0], event_id)


    if status is None or start_datetime is None:
        print(f"Error retrieving event information. Exiting...")
        vs.stop()
        sys.exit(1)

    # Loop over the frames from the video stream
    while True:
        frame = vs.read()
        

        if frame is None:
            print("Failed to capture frame from camera. Exiting...")
            break

        frame = cv2.flip(frame, 1)
        
        frame = cv2.resize(frame, (960, 720))

        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
        net.setInput(blob)
        detections = net.forward()

        # Inside the main loop for face recognition
        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]

            if confidence > 0.5:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")

                if startX < 0 or startY < 0 or endX > w or endY > h:
                    continue

                face = frame[startY:endY, startX:endX]

                if face.size == 0:
                    continue

                rgb_face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
                face_encoding = face_recognition.face_encodings(rgb_face)

                if len(face_encoding) > 0:
                    face_encoding = face_encoding[0]
                    matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.50)
                    face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances)

                    if matches[best_match_index]:
                        name = known_face_names[best_match_index]

                        # Check if the person has already been marked
                        if name not in marked_faces:
                            # Determine if late based on the attendance function
                            is_late = mark_attendance_if_pending(name, event_id)
                            marked_faces[name] = is_late  # Store the lateness status for future frames

                        # Set box color and label based on lateness status
                        if marked_faces[name]:  # If marked as late
                            box_color = (0, 255, 255)  # Yellow box for late attendees
                            text = f"LATE: {name}"
                        else:
                            box_color = (0, 255, 0)  # Green box for on-time attendees
                            text = f"ON TIME: {name}"
                    else:
                        name = "Unknown"
                        box_color = (0, 0, 255)  # Red box for unknown faces
                        text = f"{name}: {confidence * 100:.2f}%"

                    # Set larger font scale and thicker line
                    font_scale = 0.8
                    font_thickness = 2

                    # Display bounding box and name with confidence
                    y = startY - 10 if startY - 10 > 10 else startY + 10
                    cv2.rectangle(frame, (startX, startY), (endX, endY), box_color, 2)
                    cv2.putText(frame, text, (startX, y), cv2.FONT_HERSHEY_SIMPLEX, font_scale, box_color, font_thickness)


        # Overlay the attendance status board
        display_attendance_status_board(frame, marked_faces)

        # Overlay the countdown timer
        display_countdown_timer(frame, start_datetime, GRACE_PERIOD_MINUTES)


        cv2.imshow("Attendance System", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            break

    cv2.destroyAllWindows()
    vs.stop()



if __name__ == "__main__":
    if len(sys.argv) > 1:
        event_id = sys.argv[1]
        
        try:
            main(event_id)
        except Exception as e:
            print(f"An error occurred in the main function: {str(e)}")
            sys.exit(1)
    else:
        print("Error: No event ID provided")
        sys.exit(1)