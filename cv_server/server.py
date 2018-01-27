import os
import json, requests, base64
from flask import Flask, render_template, request

app = Flask(__name__)

UPLOAD_FOLDER = os.path.basename('uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


API_KEY=os.environ['API_KEY']
GCPV_ENDPOINT="https://vision.googleapis.com/v1/images:annotate?key="+API_KEY

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['image']
    f = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    
    # add your custom code to check that the uploaded file is a valid image and not a malicious file (out-of-scope for this post)
    file.save(f)

    # todo: change this to return a JSON response
    return render_template('index.html')

def get_as_base64(url):
    return base64.b64encode(requests.get(url).content)

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
    return image_content
