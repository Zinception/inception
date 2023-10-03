const form = document.querySelector('form')
const result = document.querySelector('#result')
const imgPreview = document.querySelector('#uploaded-image')

// Add an event listener to the file input element to show the image preview
form.querySelector('input[name="file"]').addEventListener('change', (e) => {
  e.preventDefault()
  const file = e.target.files[0]
  
  // Set the preview image source to the selected file
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    imgPreview.src = reader.result;
  }, false);
  reader.readAsDataURL(file);
  
  // Clear any previous prediction results from the page
  result.innerHTML = ''
})

// Add an event listener to the form to submit the file for prediction
form.addEventListener('submit', (e) => {
  e.preventDefault() // Prevent form submission
  
  const file = form.querySelector('input[name="file"]').files[0]

  const formData = new FormData()
  formData.append('file', file)
  
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText)
      let html = ''
      data.forEach((d) => {
        html += `<p>${d[0]}: ${d[1]}</p>`
      })
      result.innerHTML = html
    }
  }
  xhr.open('POST', '/predict', true)
  xhr.send(formData)
})