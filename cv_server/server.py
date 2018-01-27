import os
import json, requests, base64
from flask import Flask, render_template, request

from PIL import Image, ImageDraw
from io import BytesIO
import cStringIO


app = Flask(__name__)

UPLOAD_FOLDER = os.path.basename('uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


API_KEY=os.environ['API_KEY']
GCPV_ENDPOINT="https://vision.googleapis.com/v1/images:annotate?key="+API_KEY

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/recv_url', methods=['POST'])
def recv_url():
    img_url = request.form.get("img_url")
    # todo: return the results of whatever the CV library returns
    print img_url
    return "this is the uglified image url"

def get_as_base64(url):
    return base64.b64encode(requests.get(url).content)

def draw_face(image, img_data):
    face = img_data[0]['faceAnnotations'][0]['landmarks']
    print "face", face
    for a in face:
        if a['type']=="LEFT_EYE":
            pos = a['position']
            left_eye=(pos['x'], pos['y'])
        elif a['type']=="RIGHT_EYE":
            pos = a['position']
            right_eye=(pos['x'], pos['y'])
    im = Image.open(BytesIO(base64.b64decode(image)))
    draw = ImageDraw.Draw(im)
    draw.rectangle(left_eye + tuple([(x+15) for x in left_eye]), fill=(0,255,0))
    draw.rectangle(right_eye + tuple([(x+15) for x in right_eye]), fill=(0,255,255))
    del draw
    buffer = cStringIO.StringIO()
    im.save(buffer, format="JPEG")
    img_str = base64.b64encode(buffer.getvalue())
    return img_str

def detect_face(image_content):
    image={'content':image_content}
    features={'type':"FACE_DETECTION", 'maxResults':1}
    req={
        'image':image,
        'features':features
    }
    r = requests.post(GCPV_ENDPOINT, data=json.dumps({'requests':req}))
    print("response", r.status_code)
    if r.status_code==200:
        print r.text
        data = json.loads(r.text)["responses"]
        image_drawn = draw_face(image_content, data)
    return image_drawn
