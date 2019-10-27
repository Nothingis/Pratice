import React, { Component } from 'react';
import basicQuizQuestions from './api/basicQuizQuestions';
import scoringQuizQuestions from './api/scoringQuizQuestions';
import logo from './svg/Pin1.svg';
import Quiz from './components/Quiz';
import Result from './components/Result';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizId: '',
      currentQuiz: {},
      // user가 풀 문제의 수
      questionCount: 7,
      // 푼 문제 수
      counter: 0,
      // 현재 question의 id
      questionId: 0,
      question: '',
      // 답 보기들
      answerOptions: [],
      // 제시된 답
      answer: '',
      correctCount: 0,
      result: ''
    };
    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentDidMount() {
    // const questionCount = (this.state.questionCount > basicQuizQuestions.length) ? basicQuizQuestions.length : this.state.questionCount;
    const shuffledAnswerOptions = basicQuizQuestions.map((question) => this.shuffleArray(question.answers));
    this.setState({
      question: basicQuizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
  }

  setQuiz = (event) => {
    const quizId = event.target.id;
    const currentQuiz = (quizId === "basic") ? basicQuizQuestions : scoringQuizQuestions;
    const questionCount = (this.state.questionCount > currentQuiz.length) ? currentQuiz.length : this.state.questionCount;
    const shuffledAnswerOptions = currentQuiz.map((question) => this.shuffleArray(question.answers));
    this.setState({
      quizId: quizId,
      currentQuiz: currentQuiz,
      questionCount: questionCount,
      question: currentQuiz[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
  }
  shuffleArray(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    this.setState({
      counter: counter,
      questionId: questionId,
      question: this.state.currentQuiz[counter].question,
      answerOptions: this.state.currentQuiz[counter].answers,
      answer: ""
    });
  }


  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    console.log(this.state.counter);
    console.log(basicQuizQuestions.length);
    if (this.state.counter < this.state.currentQuiz.length - 1) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }
  setUserAnswer(answer) {
    console.log(answer);
    const correctCount = (answer === "correct") ? this.state.correctCount + 1 : this.state.correctCount;
    this.setState({
      answer: answer,
      correctCount: correctCount
    });
  }

  getResults() {
    /*
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map(key => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    //return answersCountKeys.filter(key => answersCount[key] === maxAnswerCount);
    */
    return this.state.correctCount;
  }

  setResults(result) {
    /*
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: 'Undetermined' });
    }
    */

    let res = (this.state.questionCount - result) + "개 틀렸습니다.";
    if (result === this.state.questionCount)
      res = "축하합니다~! 모두 다 맞았습니다.";
    this.setState({ result: res });
  }

  renderHome() {
    return (
      <div>
        <h2 className="homeText"> 퀴즈를 선택하세요</h2>
        <li className="homeOption">
          <input type="button" className="homeButton" id="basic" value="마작기본" onClick={this.setQuiz} />
          <input type="button" className="homeButton" id="scoring" value="마작족보" onClick={this.setQuiz} />
        </li>
      </div>
    );
  }

  renderQuiz() {
    return (
      <Quiz
        quizId={this.state.quizId}
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={basicQuizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return (
      <Result quizResult={this.state.result} />
    );
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>마작 퀴즈</h2>
        </div>
        {this.state.quizId === '' ? this.renderHome() : this.state.result ? this.renderResult() : this.renderQuiz()}
      </div>

    );
  }
}

