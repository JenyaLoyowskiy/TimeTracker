import { withFirebase } from '../Firebase';
import React from 'react';
class Timer extends React.Component{
    state = {
        timerValue:'00:00:00',
        sec:0,
        min:0,
        hour:0,
        ImageSrc:'/img/play-btn.png',
        startedAt: undefined,
        endedAt: undefined,
        projectSelector: null,
        taskSelector: null,
        timeForUpdate: 0,
        timeTracker: null
    };
    constructor(props){
        super(props);
        this.isGoing = false;
    }
    startTimer(){
        let { sec, min, hour, timeForUpdate } = this.state;
        this.setState({ImageSrc: './img/pause-btn.png'});
        this.state.startedAt = new Date();
        this.state.timeTracker = setInterval(()=>{
            sec++;
            if(sec === 60){sec = 0; min++; timeForUpdate++};
            if(min === 60){min = 0; hour++};
            let newSec = '00' + ((sec).toString());
            newSec = newSec.slice(newSec.length - 2);
            let newMin = '00' + ((min).toString());
            newMin = newMin.slice(newMin.length - 2);
            let newHour = '00' + ((hour).toString());
            newHour = newHour.slice(newHour.length - 2);
            this.setState({timerValue: newHour+':'+newMin+':'+newSec});
            if (timeForUpdate > 14){
                let { projectSelector, taskSelector, startedAt, endedAt, timerValue } = this.state;
                this.save({project: projectSelector, task: taskSelector, startedAt: startedAt, endedAt: new Date(), timer: timerValue});
                timeForUpdate = 0;
            }
        },1000);
    }
    stopTimer(){
        this.state.endedAt = new Date();
        this.saveAndClearTracker();
        this.setState({ImageSrc: '/img/play-btn.png'});
    }
    newTimer(){
        if (!this.state.isGoing){
            if (this.state.projectSelector){
                this.startTimer();
                this.state.isGoing = !this.state.isGoing;
            } else {
                alert('Please select a project');
            }
        } else {
            this.stopTimer();
            this.state.isGoing = !this.state.isGoing;
        }
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    save(obj){
        const { email } = this.props.firebase.auth.currentUser;
        if (this.state.timerValue !== '00:00:00'){
            this.props.firebase.db.collection("users").doc(`${email}`).collection('time').doc(`${this.state.startedAt}`).set({time: obj});
        }
    }

    saveAndClearTracker() {
            let { projectSelector, taskSelector, startedAt, endedAt, timerValue } = this.state;
            this.setState({ImageSrc: './img/play-btn.png', timerValue: '00:00:00', sec:0, min:0, hour:0});
            this.save({project: projectSelector, task: taskSelector, startedAt: startedAt, endedAt: endedAt, timer: timerValue});
            clearInterval(this.state.timeTracker);
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

    // showPopup(text) {
    //     let popup = document.querySelector('.popup');
    //     popup.innerHTML = text;
    //     popup.style.top = 0;
    //     setTimeout(()=>{
    //         popup.style.top = -50;
    //     },1500)
    // }

    render(){
        return(
            <div className={'timeTracker form'}>
                <div className={'tracker'}>{this.state.timerValue}</div>
                <img className={'playImage'} src={this.state.ImageSrc} onClick={this.newTimer.bind(this)}/>
                    <select className={'projectSelector'} name={'projectSelector'} onChange={this.onChange}>
                        <option>Select project</option>
                        <option>Mobile app</option>
                        <option>Ben's project</option>
                    </select>
                    <select className={'taskSelector'} name={'taskSelector'} onChange={this.onChange}>
                        <option>Select task</option>
                        <option>Task 1</option>
                        <option>Task 2</option>
                    </select>
                <button onClick={this.getData.bind(this)}>Get data</button>
            </div>
        )
    }
}

export default withFirebase(Timer);