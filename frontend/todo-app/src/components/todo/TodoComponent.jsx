import React, { Component } from 'react'
import moment from 'moment'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import TodoDataService from '../../api/todo/TodoDataService.js'
import AuthenticationService from './AuthenticationService.js'
import "../profilewall/status.scss"

class TodoComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match ? this.props.match.params.id ? this.props.match.params : -1 : -1,
            description: '',
            targetDate: moment(new Date()).format('YYYY-MM-DD')
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)

    }

    componentDidMount() {
        if (this.state.id === -1) {
            return
        }

        let username = AuthenticationService.getLoggedInUserName()

        TodoDataService.retrieveTodo(username, this.state.id)
            .then(response => this.setState({
                description: response.data.description,
                targetDate: moment(response.data.targetDate).format('YYYY-MM-DD')
            }))
    }

    validate(values) {
        let errors = {}
        if (!values.description) {
            errors.description = 'Enter a Description'
        } else if (values.description.length < 5) {
            errors.description = 'Enter atleast 5 Characters in Description'
        }

        if (!moment(values.targetDate).isValid()) {
            errors.targetDate = 'Enter a valid Target Date'
        }

        return errors
    }

    onSubmit(values) {
        let username = AuthenticationService.getLoggedInUserName()

        let todo = {
            id: this.state.id,
            description: values.description,
            targetDate: values.targetDate
        }

        if (this.state.id === -1) {
            TodoDataService.createTodo(username, todo)
                .then(() => {this.props.refreshTodos(); this.props.stompClient.send("/app/postStatus", {}, true)})
        } else {
            TodoDataService.updateTodo(username, this.state.id, todo)
                .then(() => {this.props.refreshTodos(); this.props.stompClient.send("/app/postStatus", {}, true)})
        }

        this.setState({description: ''})
        console.log(values);

    }

    handleChange = (event) => {
        this.setState({
            description: event.target.value
        });
    }

    render() {

        let { description, targetDate } = this.state
        //let targetDate = this.state.targetDate

        return (
            <div>
                    <Formik
                        initialValues={{ description, targetDate }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="description" component="div"
                                        className="alert alert-warning" />
                                    <ErrorMessage name="targetDate" component="div"
                                        className="alert alert-warning" />

                                
                                    <fieldset className="form-group ui-block ui-custom">
                                        <div className="create-content">
                                            <Field className="form-control post-status" type="text" name="description" value={this.state.description} placeholder={"Hey " + this.props.username + ", what are you thinking?"} onChange={this.handleChange}/>
                                        </div>
                                        <div className="create-tool">
                                            <button className="btn btn-primary btn-status" type="submit">Post</button>
                                        </div>

                                    </fieldset>
                                </Form>
                            )
                        }
                    </Formik>


            </div>
        )
    }
}

export default TodoComponent