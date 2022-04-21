// 有道单词收藏
;(async function collect() {
  const words = ['memo', '']

  const $ = (selector) => document.querySelector(selector)
  const delay = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  for (const word of words) {
    const input = $('#search_input')
    const inputEvent = new InputEvent('input', {})
    input.value = word
    input.dispatchEvent(inputEvent)
    $('.translate_btn').click()
    await delay(1000)
    const star = $('.word-operate')
    if (!star.classList.value.includes('added')) {
      $('.word-operate').click()
    }
  }
})()
