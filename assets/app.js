let configuration = { 'difficulty': 'easy', 'category': 11, 'numberOfQuestions': 10 }

const getUrlApi = ({ numberOfQuestions, category, difficulty }) => {

  return `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`

}

let questions = []
let currentQuestion = 0
let question = {}
let answers = []
let points = 0

const resetQuiz = () => {

  formReset()

  questions = []
  currentQuestion = 0
  question = {}
  answers = []
  points = 0

}

// selectors
const modal = document.querySelector('.modal')
const modalConfig = document.querySelector('#config-modal.modal')
const closeConfigButton = document.querySelector('.close-config-modal')
const formConfig = document.querySelector('form#config-form')
const pointsPainel = document.querySelector('#points')
const questionQuote = document.querySelector('#question-quote')
const anwerZero = document.querySelector('#anwer-zero')
const anwerOne = document.querySelector('#anwer-one')
const anwerTwo = document.querySelector('#anwer-two')
const anwerThree = document.querySelector('#anwer-three')
const nextButton = document.querySelector('#next')
const previousButton = document.querySelector('#previous')
const currentQuestionElement = document.querySelector('#current-question')
const numberOfQuestionsElement = document.querySelector('#number-of-questions')
const anwerListElement = document.querySelector('div.list-group')
const form = document.querySelector('form')
const finishButton = document.querySelector('a#finish')
const configurationElement = document.querySelector('a#configuracao')
const listGroupElement = document.querySelector('div.list-group')
const errorAudio = document.querySelector("#error-audio");
const successAudio = document.querySelector("#success-audio");
const muteButton = document.querySelector("#mute-button");
const mutedBanArea = document.querySelector('span#ban-area')

// end selectors

// functions

const navigatorCanShare = () => navigator.share

const muteToggle = () => {

  const banHTML = '<i class="fa fa-ban fa-stack-2x" style="color: tomato;"></i>'

  if (errorAudio.muted === true) {

    errorAudio.muted = false
    successAudio.muted = false

    mutedBanArea.innerHTML = null

    return

  }

  errorAudio.muted = true
  successAudio.muted = true

  mutedBanArea.innerHTML = banHTML

  return

}

const shuffle = array => {
 
  let ctr = array.length
  let temp
  let index

  // While there are elements in the array
  while (ctr > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * ctr)
    // Decrease ctr by 1
    ctr--
    // And swap the last element with it
    temp = array[ctr]
    array[ctr] = array[index]
    array[index] = temp
  }
  return array
}

const clearAllOptions = () => {

  const allOptions = document.querySelectorAll('div.list-group a')
  allOptions.forEach(option => option.classList.remove('active'))

}

const formReset = () => {

  form.reset()
  clearAllOptions()


}

const configure = (difficulty, numberOfQuestions, category) => {

  configuration = { difficulty, category, numberOfQuestions }

  return

}

const showModal = (title, message, error) => {

  modal.querySelector('.modal-body').innerHTML = message

  if (error) {

    modal.querySelector('.modal-header').classList.add('bg-danger')
    modal.querySelector('.modal-body').classList.add('bg-danger')
    modal.querySelector('.modal-footer').classList.add('bg-danger')
    modal.querySelector('.modal-title').innerHTML = `<i class="fa fa-exclamation fa-fw"></i> ${title}`

    errorAudio.play()

  } else {

    modal.querySelector('.modal-header').classList.add('bg-success')
    modal.querySelector('.modal-body').classList.add('bg-success')
    modal.querySelector('.modal-footer').classList.add('bg-success')
    modal.querySelector('.modal-title').innerHTML = `<i class="fa fa-check fa-fw"></i> ${title}`

    successAudio.play()

  }

  modal.setAttribute('style', 'display:block')

  if (error) {

    modal.classList.add('ahashakeheartache')
  }

}

const fetchQuestions =  async () => {

  resetQuiz()

  fetch(getUrlApi(configuration)).then( response => {

    return response.json()


  }).then( data => {

    boot(data)

  }).catch(error => {

    const applicationError = true

    const message = `Ocorreu um erro ao tentar pegar as penguntas da API.<br>
              <br>
              URL:
              <br>
              <a class="link" href="${getUrlApi(configuration)}" target="_blank">${getUrlApi(configuration)}</a>
              <br>
              ERRO:
              <br>
              <b>${error}</b>
              `

    showModal('Applicaton Error', message, applicationError)


  })


}


const render = () => {

  formReset()

  pointsPainel.textContent = points
  question = questions[currentQuestion]
  questionQuote.innerHTML = question.question
  anwerZero.innerHTML = question.correct_answer
  question.answers = shuffle([question.correct_answer, ...question.incorrect_answers])

  anwerZero.innerHTML  = question.answers[0]
  anwerOne.innerHTML   = question.answers[1]
  anwerTwo.innerHTML   = question.answers[2]
  anwerThree.innerHTML = question.answers[3]

  currentQuestionElement.textContent = currentQuestion + 1

  numberOfQuestionsElement.textContent = configuration.numberOfQuestions


}

const goTo = questionIndex => {


  question = questions[currentQuestion]
  currentQuestion = questionIndex

  render()
}



const closeModal = () => {

  modal.setAttribute('style', 'display:hide')

  modal.querySelector('.modal-header').classList.remove('bg-danger')
  modal.querySelector('.modal-body').classList.remove('bg-danger')
  modal.querySelector('.modal-footer').classList.remove('bg-danger')
  modal.querySelector('.modal-header').classList.remove('bg-success')
  modal.querySelector('.modal-body').classList.remove('bg-success')
  modal.querySelector('.modal-footer').classList.remove('bg-success')
  modal.querySelector('.modal-title').innerHTML = ''

  modal.classList.remove('ahashakeheartache')

  modal.querySelector('.modal-body').textContent = null

}

const showModalConfig = () => {

  formConfig.difficulty.value = configuration.difficulty
  formConfig.category.value = configuration.category
  formConfig.numberOfQuestions.value = configuration.numberOfQuestions

  modalConfig.setAttribute('style', 'display:block')

}

const closeModalConfig = () => {

  modalConfig.setAttribute('style', 'display:hide')

}

const finishQuiz = () => {

  console.log('O jogo acababou... vamos reiniciar')

  fetchQuestions()

}


const boot = (questionsData) => {

  alert(`O seu navegador faz o share? ${navigator.share}`)

  questions = questionsData.results

  render()

}

// end functions 


// listeners

muteButton.addEventListener('click', event => {

  event.preventDefault()

  muteToggle()


  return

})

listGroupElement.addEventListener('click', event => {

  const selectedOption = document.querySelector(`[data-js="${event.target.dataset.js}"]`)

  clearAllOptions()
  selectedOption.classList.toggle('active')

  const radio = selectedOption.querySelector('input')

  radio.checked = true

})

formConfig.addEventListener('submit', event => {

  event.preventDefault()

  configure(event.target.difficulty.value, event.target.numberOfQuestions.value, event.target.category.value)

  fetchQuestions()
  closeModalConfig()

  return

})

configurationElement.addEventListener('click', event => {

  event.preventDefault()

  showModalConfig()



})


finishButton.addEventListener('click', event => {

  event.preventDefault()

  finishQuiz()

  return

})

nextButton.addEventListener('click', event => {

  event.preventDefault()

  if (currentQuestion + 1 < configuration.numberOfQuestions) {

    const questionIndex = currentQuestion + 1

    goTo(questionIndex)

    return
  }

})

previousButton.addEventListener('click', event => {

  event.preventDefault()

  if (currentQuestion - 1 >= 0) {

    const questionIndex = currentQuestion - 1

    goTo(questionIndex)

    return
  }

})

modal.addEventListener('click', event => {

  event.preventDefault()

  clickedElementTag = event.target.tagName

  haveCloseClass = event.target.classList.contains('close') || event.target.classList.contains('close-modal')

  if(haveCloseClass){

    closeModal()
  }

})

closeConfigButton.addEventListener('click', event => {

  event.preventDefault()

  closeModalConfig()

})

form.addEventListener('submit', event => {

  event.preventDefault()

  questions[currentQuestion].selectedAnswerIndex = Number(event.target.a.value)

  const resposta = question.answers[event.target.a.value]

  if (resposta === question.correct_answer) {

    showModal('Congratulations!', `Right answer, ${question.correct_answer}.`, false)
    points += 10

  } else {

    showModal('Error',` Wrong! The correct answer is ${question.correct_answer}.`, true)
  }

  event.target.reset()

  if (currentQuestion + 1 < configuration.numberOfQuestions) {

    goTo(currentQuestion + 1)

  } else {

    finishQuiz()

  }


})

// end listeners


fetchQuestions()