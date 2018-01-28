import os
import json, requests, base64
from flask import Flask, render_template, request

from PIL import Image, ImageDraw
from io import BytesIO
import cStringIO

# f1 = Image.open("masks/f3.png", 'r')
# f2 = Image.open("masks/f2.png", 'r')
# f2_mask = Image.open("f2.png", 'r')

eye_l = Image.open("masks/eye_l.png", 'r')
eye_r = Image.open("masks/eye_r.png", 'r')

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
    height = request.form.get("height")
    width = request.form.get("width")
    top = request.form.get("top")
    left = request.form.get("left")
    # todo: return the results of whatever the CV library returns
    print img_url
    print height
    print width
    print top
    print left

    new_img = detect_face(img_url)
    return new_img


def get_as_base64(url):
    return base64.b64encode(requests.get(url).content)

def draw_face(image, img_data):
    # load image, open for drawing
    im = Image.open(BytesIO(base64.b64decode(image)))
    # draw = ImageDraw.Draw(im)

    #get face data
    face = img_data[0]['faceAnnotations'][0]['landmarks']
    print "face", face
    for a in face:
        pos = a['position']
        if a['type']=="LEFT_EYE":
            left_eye=(pos['x'], pos['y'])
        elif a['type']=="LEFT_EYE_LEFT_CORNER":
            left_eye_l=(pos['x'], pos['y'])
        elif a['type']=="LEFT_EYE_RIGHT_CORNER":
            left_eye_r=(pos['x'], pos['y'])

        elif a['type']=="RIGHT_EYE":
            right_eye=(pos['x'], pos['y'])
        elif a['type']=="RIGHT_EYE_LEFT_CORNER":
            right_eye_l=(pos['x'], pos['y'])
        elif a['type']=="RIGHT_EYE_RIGHT_CORNER":
            right_eye_r=(pos['x'], pos['y'])

        elif a['type']=="UPPER_LIP":
            upper_lip=(pos['x'], pos['y'])
        elif a['type']=="LOWER_LIP":
            lower_lip=(pos['x'], pos['y'])
        elif a['type']=="MOUTH_LEFT":
            mouth_left=(pos['x'], pos['y'])
        elif a['type']=="MOUTH_RIGHT":
            mouth_right=(pos['x'], pos['y'])

        elif a['type']=="CHIN_LEFT_GONION":
            chin_left=(pos['x'], pos['y'])
        elif a['type']=="CHIN_RIGHT_GONION":
            chin_right=(pos['x'], pos['y'])
        elif a['type']=="NOSE_BOTTOM_LEFT":
            nose_left=(pos['x'], pos['y'])
        elif a['type']=="NOSE_BOTTOM_RIGHT":
            nose_right=(pos['x'], pos['y'])
        # draw.rectangle( (pos['x']-1, pos['y']-1) + (pos['x']+1, pos['y']+1), fill=(0,255,0))

    # del draw

    # draw left eyes
    size=int( abs(left_eye_l[0]-left_eye_r[0]) * 1.2) 
    eye = eye_l.resize((size,size))
    im.paste(eye, (int(left_eye[0]-(size/2)), int(left_eye[1]-(size/2))), mask=eye)

    # draw left eyes
    size=int( abs(right_eye_l[0]-right_eye_r[0]) * 1.2)
    eye = eye_r.resize((size,size))
    im.paste(eye, (int(right_eye[0]-(size/2)), int(right_eye[1]-(size/2))), mask=eye)

    # get mouth & rotate
    t_l = (int(min(upper_lip[0],mouth_left[0])-5), int(min(upper_lip[1], mouth_left[1]))-5 )
    b_r = (int(max(lower_lip[0],mouth_right[0])+5), int(max(lower_lip[1],mouth_right[1]))+5 )

    img2 = im.crop(t_l + b_r).rotate(180)
    w , h = [int(x * 1.3) for x in img2.size]
    img2 = img2.resize((w, h))
    t_l = ( t_l[0]-(w-img2.size[0]), t_l[1]-(h-img2.size[1]) )
    im.paste(img2, t_l) # draw mouth

    # face = f1.transform(f1.size, Image.QUAD, original, resample=Image.BICUBIC)
    # face_mask = f1_mask.transform(f1.size, Image.QUAD, original, resample=Image.BICUBIC)

    # face = f2.resize((int(x_max-x_min), int(y_max-y_min)))
    # face_mask = f2_mask.resize((int(x_max-x_min), int(y_max-y_min)))
    # im.paste(face, (int(x_min), int(y_min)), mask=face_mask)

    # face = f1.resize((int(x_max-x_min), int(y_max-y_min)))
    # im.paste(face, (int(x_min), int(y_min)), mask=face)

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
