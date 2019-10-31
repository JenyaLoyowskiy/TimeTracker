import { withFirebase } from '../Firebase';
import React from 'react';
import * as ROUTS from '../../constants/routes.js';

class TimerIndicator extends React.Component{
    state = {
        timerValue: '00:00:00',
        sec:0,
        min:0,
        hour:0,
        timeTracker: null,
        imageSrc: './img/play-btn.png',
        startedAt: null,
        endedAt: null,
        isGoing: true
    };
    constructor(props){
        super(props);
    }

    newTimer(){
        if (this.state.isGoing){
            if (this.props.projectSelected && this.props.projectSelected !== 'Select the project' && this.props.taskSelected && this.props.taskSelected !== 'Select the task') {
                this.startTimer();
                this.state.isGoing = !this.state.isGoing;
            } else {
                alert('Select project and task please')
            }
        } else {
            let time = {
                startedAt: this.state.startedAt,
                endedAt: new Date(),
                time: this.state.timerValue
            };
            this.props.save(time);
            this.stopTimer();
            this.state.isGoing = !this.state.isGoing;
        }
    }

    startTimer(){
        let { sec, min, hour, timeForUpdate } = this.state;
        this.setState({imageSrc: './img/pause-btn.png'});
        this.state.startedAt = new Date();
        this.state.timeTracker = setInterval(()=>{
            sec++;
            if(sec === 60){sec = 0; min++; timeForUpdate++};
            if(min === 60){min = 0; hour++};
            let newSec = ('00' + sec.toString()).substr(-2);
            let newMin = ('00' + min.toString()).substr(-2);
            let newHour = ('00' + hour.toString()).substr(-2);
            this.setState({timerValue: newHour+':'+newMin+':'+newSec});
        },1000);
    }

    stopTimer(){
        this.setState({imageSrc: './img/play-btn.png', timerValue: '00:00:00'});
        clearInterval(this.state.timeTracker);
    }

    render(){
        return(
            <div className={'timeWrapper'}>
                <div className={'tracker'}>
                    {this.state.timerValue}
                </div>
                <img className={'playImage'} src={this.state.imageSrc} onClick={ this.newTimer.bind(this) }/>
            </div>
        )
    }
}

class TaskSelectors extends React.Component{
    state = {
        data: [],
        projects: ['project1', 'project2', 'project3']
    };

    constructor(props){
        super(props);
        this.getData();
    }

    async getData(){
        try {
            const response = await fetch(`https://api.trello.com/1/boards/SrhQGIYA?cards=all`);
            if (!response.ok) {
                throw Error(response.statusText);
            }
            const json = await response.json();
            json.cards = json.cards.filter(el=>el.closed === false);
            this.setState({ data: Array.from(json.cards) });
            console.log(json.cards);
        } catch (error) {
            console.log(error);
        }
    }

    renderProjects(){
        const { projects } = this.state;
        return projects.map(el=>{
            return (
                <option key={Math.random()}>{el}</option>
            )
        })
    }

    renderTasks(){
        const { data } = this.state;
        return data.map(el=>{
            return (
                <option key={Math.random()}>{el.name}</option>
            )
        })
    }

    render(){
        return(
            <div className={'selectWrapper'}>
                <select name={'projectSelector'} className={'projectSelector'} onChange={this.props.updateSelectors} value={this.props.projectSelected ? this.props.projectSelected : ''}>
                    <option>Select the project</option>
                    { this.renderProjects() }
                </select>
                <select name={'taskSelector'} className={'taskSelector'} onChange={this.props.updateSelectors} value={this.props.taskSelected ? this.props.taskSelected : ''}>
                    <option>Select the task</option>
                    { this.renderTasks() }
                </select>
            </div>
        )
    }
}

class Timer extends React.Component{
    state = {
        taskSelector: null,
        projectSelector: null,
    };
    constructor(props){
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    updateData(event){
        this.setState({[event.target.name]: event.target.value});
        console.log(event.target.name, event.target.value);
    }

    save(obj){
        const { email } = this.props.firebase.auth.currentUser;
        const { taskSelector, projectSelector} = this.state;
        if (this.state.timerValue !== '00:00:00'){
            this.props.firebase.db.collection("users").doc(`${email}`).collection(`${projectSelector}`).doc(`${taskSelector}`).collection('time').add({time: obj});
            // this.saveToTrello();
        }
    }

    saveAndClearTracker() {
            let { startedAt, endedAt, timerValue } = this.state;
            this.setState({ImageSrc: './img/play-btn.png', timerValue: '00:00:00', sec:0, min:0, hour:0});
            this.save({startedAt: startedAt, endedAt: endedAt, timer: timerValue});
            clearInterval(this.state.timeTracker);
    }

    saveToTrello(){
        const select = document.querySelector('.taskSelector').value;
        const currentCard = this.state.data.filter(el=>el.name == select);
        let descr = currentCard[0].desc;
        let text;
        if (currentCard[0].desc[currentCard[0].desc.length - 3] === ':'){
            text = descr.slice(0, descr.length - 9) + ' ' + this.state.timerValue;
        } else {
            text = descr + ' ' + this.state.timerValue;
        }

        console.log(currentCard);
        var data = null;

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", () => {
            if (this.readyState === this.DONE) {
                console.log(this.responseText);
            }
        });

        xhr.open("PUT", `https://api.trello.com/1/cards/${currentCard[0].id}?desc=${text}&key=${ROUTS.trelloKey}&token=${ROUTS.trelloToken}`);

        xhr.send(data);
    }

    getData() {
        const { email } = this.props.firebase.auth.currentUser;
        const docRef = this.props.firebase.db.collection("users").doc(`${email}`).collection('time');
        let today = new Date();
        docRef.onSnapshot(function(snapshot) {
            snapshot.forEach(function(document) {
                let start = document.data().time.startedAt;
                var newDate = new Date(start.seconds*1000);
                if (newDate.getMonth() === today.getMonth()){
                    console.log(document.data().time.timer);
                }
            });
        });
    }

    render(){
        return(
            <div className={'timeTracker form'}>
                <TimerIndicator
                    updateData={this.updateData}
                    startTimer={this.changeTimerValue}
                    save={(obj)=>{this.save(obj)}}
                    projectSelected={this.state.projectSelector}
                    taskSelected={this.state.taskSelector}
                />
                <TaskSelectors
                    updateSelectors={this.updateData}
                    projectSelected={this.state.projectSelector}
                    taskSelected={this.state.taskSelector}
                />
            </div>
        )
    }
}

export default withFirebase(Timer);
