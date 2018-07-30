import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { API } from "aws-amplify";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      meals: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const meals = await this.meals();
      this.setState({ meals });
    } catch (e) {
      alert(e.message);
    }

    this.setState({ isLoading: false });
  }

  meals() {
    return API.get("meals", "/meals")
  }

  renderMealsList(meals) {
    return [{}].concat(meals).map(
      (meal, i) =>
        i !== 0
          ? <ListGroupItem
              key={meal.id}
              href={`meals/${meal.id}`}
              onClick={this.handleMealClick}
              header={meal.description.trim().split("\n")[0]}
            />
          : <ListGroupItem
              key="new"
              href="meals/new"
              onClick={this.handleNoteClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a meal
              </h4>
            </ListGroupItem>
    );
  }

  handleMealClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Meal Planner</h1>
        <p>A meal planning app</p>
      </div>
    );
  }

  renderMeals() {
    return (
      <div className="meals">
        <PageHeader>Meals</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderMealsList(this.state.meals)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderMeals() : this.renderLander()}
      </div>
    );
  }
}
