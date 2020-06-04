import React, { Component } from 'react';
import Formik from 'formik';
import * as yup from 'yup';

class AddLaunch extends Component {
    state = {

    }
    
    handleSubmit = () => {

    }

    handleChange = () => {

    }

    render() {
        return (
            <div>
                <h1>My Form</h1>
                <Formik
                initialValues={{ name: 'jared' }}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    actions.setSubmitting(false);
                    }, 1000);
                }}
                >
                    <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        onChange={this.handleChange}
                        value={this.values.name}
                        name="name"
                    />
                    {this.errors.name && <div id="feedback">{this.errors.name}</div>}
                    <button type="submit">Submit</button>
                    </form>
                </Formik>
            </div>
        )
    }
}

export default AddLaunch;