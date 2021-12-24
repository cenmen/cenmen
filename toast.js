function toast({text, duration = 2000}) {
  const timeout = window._toastTimeout
  const PARENT_ID = 'toast-container'
  let parent = document.querySelector(`#${PARENT_ID}`)
  if (!parent) {
    parent = document.createElement('div')
    parent.id = PARENT_ID
    parent.style = 'display:inline-block; position:fixed; left:50%; transform:translateX(-50%);'
    document.body.insertBefore(parent, document.body.children[0])
  } else {
    if (timeout) clearTimeout(timeout)
  }
  const content = document.createElement('div')
  content.style = 'background: rgba(0,0,0,0.5); padding:10px; border-radius:5px; color: #FFFFFF; white-space: nowarp; margin:2px;'
  content.innerText = text
  parent.appendChild(content)
  console.log(parent);
  window._toastTimeout = setTimeout(() => {
    const target = document.querySelector(`#${PARENT_ID}`)
    target.parentNode.removeChild(target)
  }, duration)
}