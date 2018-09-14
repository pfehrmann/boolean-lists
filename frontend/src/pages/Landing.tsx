import * as React from 'react';
import '../App.css';
import * as concert from './concert.jpg';

class Landing extends React.Component {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div>
                <img src={concert} className={"header-image"}/>
            </div>
        );
    }
}

export default Landing;
