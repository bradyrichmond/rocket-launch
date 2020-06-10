import React, { Component } from 'react';

class AddLaunch extends Component {
    state = {
        values: {
            company: '',
            streamUrl: '',
            launchTime: '',
            booster: '',
            payload: '',

        }
    }

    handleSubmit = () => {

    }

    handleChange = (e) => {
        let values = this.state.values;
        values[e.target.name] = e.target.value;
    }

    render() {
        return (
            <div className='add-launch-form'>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.values.company}
                        name="company"
                        placeholder="company"
                    />
                    <input
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.values.streamUrl}
                        name="streamUrl"
                        placeholder="streamUrl"
                    />
                    <input
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.values.launchTime}
                        name="launchTime"
                        placeholder="launchTime"
                    />
                    <input
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.values.booster}
                        name="booster"
                        placeholder="booster"
                    />
                    <input
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.values.payload}
                        name="payload"
                        placeholder="payload"
                    />
                    {/* {this.errors.name && <div id="feedback">{this.errors.name}</div>} */}
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default AddLaunch;