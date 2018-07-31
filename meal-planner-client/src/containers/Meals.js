import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Meals.css";

export default class Meals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      isDeleting: null,
      meal: null,
      description: ""
    };
  }

  async componentDidMount() {
    try {
      const meal = await this.getMeal();
      const { description } = meal;

      this.setState({
        meal,
        description
      });
    } catch (e) {
      alert(e);
    }
  }

  getMeal() {
    return API.get("meals", `/meals/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.description.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  saveMeal(meal) {
    return API.put("meals", `/meals/${this.props.match.params.id}`, {
      body: meal
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.saveMeal({
        description: this.state.description
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  deleteMeal() {
    return API.del("meals", `/meals/${this.props.match.params.id}`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to delete this meal?");

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteMeal();
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Meals">
        {this.state.meal &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="description">
              <FormControl
                onChange={this.handleChange}
                value={this.state.description}
                componentClass="textarea"
              />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving..."
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting..."
            />
          </form>}
      </div>
    );
  }
}
