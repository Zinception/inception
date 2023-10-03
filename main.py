from flask import Flask, request, render_template, jsonify
from imageai.Classification import ImageClassification
import os

app = Flask(__name__)

# Initialize ImageAI prediction model
prediction = ImageClassification()
execution_path = os.getcwd()
prediction.setModelTypeAsMobileNetV2()
prediction.setModelPath(os.path.join(execution_path, "mobilenet_v2-b0353104.pth"))
prediction.loadModel()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    img = request.files['file']
    img.save('static/img/uploaded_image.jpg')
    predictions, probabilities = prediction.classifyImage(os.path.join(execution_path, "static/img/uploaded_image.jpg"), result_count=5)
    result = []
    for eachPrediction, eachProbability in zip(predictions, probabilities):
        result.append((eachPrediction , eachProbability))
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)