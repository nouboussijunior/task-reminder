import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import { timeago } from '../../../modules/dates';
import BlankState from '../../components/BlankState';
import {
  StyledDocuments,
  DocumentsList,
  Document,
  StyledListGroup,
  StyledListGroupItem,
} from './styles';
import { documents } from '../../queries/Documents.gql';
import {
  addDocument as addDocumentMutation,
  updateDocument as updateDocumentMutation,
  removeDocument as removeDocumentMutation,
} from '../../mutations/Documents.gql';
import Validation from '../../components/Validation';
import Icon from '../../components/Icon';
import { Meteor } from 'meteor/meteor';
import { difference } from 'lodash';

class Documents extends React.Component {
  state = { showPassword: false, password: '', pendingTasks: [] };

  shwoNotification = (title, message) => {
    const notification = new Notification(title, {
      body: message,
    });
    // return notification;
  };

  componentDidMount = () => {
    // this.browseAllTasks();
    let intervalID = setInterval(() => {this.browseAllTasks()}, 10000);
    const { permission } = Notification;

    console.log(permission);
    if (permission === 'granted') {
      // this.shwoNotification();
    } else if (permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        console.log(perm);
      });
    }
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    let allPendingTasks = [];
    // console.log(this.props.data.documents);
    console.log("updated");
    if(this.props.data && this.props.data.documents){
      const documents = this.props.data.documents;
      for(let i=0; i < this.props.data.documents.length; i++){
        // console.log(documents);
        if(documents[i].status == "pending"){
          allPendingTasks.push(documents[i]);
        }
      }
      if(prevProps !== this.props){
        this.setState({
          pendingTasks: allPendingTasks
        })
      }
    }
    console.log(this.state.pendingTasks);
    this.browseAllTasks();
  } 

  browseAllTasks = () => {
    for(let i = 0; i < this.state.pendingTasks.length; i++){
      this.checkTaskStatus(this.state.pendingTasks[i]._id);
    }
  }

  checkTaskStatus = (taskId) => {
    Meteor.call('checkTaskStatus', taskId, (err, res) =>{
      if (err) Bert.alert('An error occured!', 'danger');
      let remindingDate = new Date(res.remindingDate);
      if(res.remindingDate === "No-date"){
        remindingDate = new Date(res.deadLine) - 2*1000*60*60*24;
      }
      const daysDifference = (new Date() - remindingDate) / (1000*60*60);
      if(daysDifference <= 0){
        this.shwoNotification('Echéance bientot atteinte!', "Hey! L'échéance d'une tache est dépassée");
        this.playSound();
      }else if(daysDifference <= 12+10){
        this.shwoNotification('Echéance bientot atteinte!', "Hey! Une tache arrive à échéance dans quelques heures!");
        this.playSound();
      }else if(daysDifference <= 24+10){
        this.shwoNotification('Echéance bientot atteinte!', "Hey! Une tache arrive à échéance dans 1 jour!");
        this.playSound();
      }else if(daysDifference <= 48+10){
        this.shwoNotification("Echance dépassée", "Hey! Une tache arrive à échéance dans 2 jours!");
        this.playSound();
      }
      console.log(daysDifference);
      // this.setState({
      //   admins: res,
      // })
    })
  }

  playSound = () => {
    const audio = new Audio("/sound.mp3");
    audio.play()
  }

  handleSubmit = (form) => {
    this.playSound();
    // const { addDocument } = this.props;
    // addDocument({
    //   variables: {
    //     taskName: form.taskName.value,
    //     deadLine: form.taskDeadLine.value,
    //     remindingDate: form.remindingDate.value,
    //     status: 'pending',
    //   },
    // });
  };

  resolveTask = (taskId) => {
    const { updateDocument } = this.props;
    updateDocument({
      variables: {
        _id: taskId,
        status: 'resolved',
      },
    });
  };

  removeTask = (taskId) => {
    const { removeDocument } = this.props;
    if (confirm('Voulez-vous vraiment supprimer cette tâche!?')) {
      removeDocument({
        variables: {
          _id: taskId,
        },
      });
    }
  };

  getTaskPeriod = (deadLine) => {
    const dtDeadLine = new Date(deadLine);
    const dateNow = new Date();
    const diff = dtDeadLine.getDate() - dateNow.getDate();
    if (diff < 3) {
      return 'danger';
    }
    if (diff == 3) {
      return 'warning';
    }
    return 'success';
  };

  simulateClick = (e) => {
    e.target.click()
  }

  render() {
    const { data } = this.props;
    const { name } = this.props;
    return (
      // const Documents = ({ data, mutate }) => (
      <StyledDocuments ref={this.simulateClick}>
        <header className="clearfix">
          <h3>Bienvenue {name}!</h3>
        </header>

        <div>
          <Validation
            rules={{
              taskName: {
                required: true,
              },
              taskDeadLine: {
                required: true,
              },
              remindingDate: {
                required: false,
              },
            }}
            messages={{
              taskName: {
                required: 'Veuillez entrer une tâche!',
              },
              taskDeadLine: {
                required: "Précisez l'échéance.",
              },
            }}
            submitHandler={(form) => this.handleSubmit(form)}
          >
            <form onSubmit={(event) => event.preventDefault()}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <label>Tâche</label>
                    <input
                      type="text"
                      name="taskName"
                      placeholder="Nouvelle tâche"
                      // defaultValue={user.name.first}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <label>Echéance</label>
                    <input
                      type="date"
                      name="taskDeadLine"
                      placeholder="Echéance"
                      // defaultValue={user.name.last}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <label>Rappel</label>
                    <input
                      type="date"
                      name="remindingDate"
                      placeholder="Rappel"
                      // defaultValue={user.name.last}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <label className="transparent">Valider</label>
                  <Button type="submit" bsStyle="success" className="">
                    Enregistrer la Tâche
                  </Button>
                </Col>
              </Row>
            </form>
          </Validation>
        </div>

        <div>
          <Row>
            <Col md={6}>
              <h2>Tâches en cours</h2>
              {data.documents && data.documents.length ? (
                <StyledListGroup>
                  {data.documents.map(
                    ({ _id, isPublic, taskName, deadLine, updatedAt, status }) =>
                      status == 'pending' && (
                        <StyledListGroupItem key={_id}>
                          {/* <Link to={`/documents/${_id}/edit`} /> */}
                          <div className="taskItem">
                            <Col xs={1}>
                              <input
                                type="checkbox"
                                className="resolveTask"
                                onChange={() => this.resolveTask(_id)}
                              />
                            </Col>
                            <Col xs={10}>
                              {/* {isPublic ? ( */}

                              {/* ) : ( */}
                              {/* <span className="label label-default">Private</span> */}
                              {/* )} */}
                              <h3>{taskName}</h3>
                              {/* <p>{deadLine}</p> */}
                              <span className={`label label-${this.getTaskPeriod(deadLine)}`}>
                                {timeago(deadLine)}
                              </span>
                              {/* <p>{timeago(updatedAt)}</p> */}
                            </Col>
                            <Col xs={1} onClick={() => this.removeTask(_id)}>
                              <span className="deleteTask">
                                <Icon iconStyle="solid" icon="trash" />
                              </span>
                            </Col>
                          </div>
                          {/* </header> */}
                        </StyledListGroupItem>
                      ),
                  )}
                </StyledListGroup>
              ) : (
                <BlankState
                  icon={{ style: 'solid', symbol: 'file-alt' }}
                  title="Aucune tâche créée!"
                  subtitle="Créez votre premiere tâche."
                />
              )}
            </Col>
            <Col md={6}>
              <h2>Tâches réalisées</h2>
              {data.documents && data.documents.length ? (
                <StyledListGroup>
                  {data.documents.map(
                    ({ _id, isPublic, taskName, deadLine, updatedAt, status }) =>
                      status == 'resolved' && (
                        <StyledListGroupItem key={_id}>
                          {/* <Link to={`/documents/${_id}/edit`} /> */}
                          <div className="taskItem">
                            <Col xs={1} className="resolvedTask">
                              <Icon iconStyle="solid" icon="check" />
                            </Col>
                            <Col xs={10}>
                              {/* {isPublic ? ( */}

                              {/* ) : ( */}
                              {/* <span className="label label-default">Private</span> */}
                              {/* )} */}
                              <h3 className="lineThrough">{taskName}</h3>
                              <span className={`label label-${this.getTaskPeriod(deadLine)}`}>
                                {timeago(deadLine)}
                              </span>
                              {/* <p>{timeago(updatedAt)}</p> */}
                            </Col>
                            <Col xs={1} onClick={() => this.removeTask(_id)}>
                              <span className="deleteTask">
                                <Icon iconStyle="solid" icon="trash" />
                              </span>
                            </Col>
                          </div>
                          {/* </header> */}
                        </StyledListGroupItem>
                      ),
                  )}
                </StyledListGroup>
              ) : (
                <BlankState
                  icon={{ style: 'solid', symbol: 'file-alt' }}
                  title="Aucune tâche réalisée!"
                  subtitle="Realisez votre premiere tâche."
                />
              )}
            </Col>
          </Row>
        </div>
      </StyledDocuments>
    );
  }
}

Documents.propTypes = {
  data: PropTypes.object.isRequired,
  addDocument: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired,
  removeDocument: PropTypes.func.isRequired,
};

export default compose(
  graphql(documents),
  graphql(addDocumentMutation, {
    name: 'addDocument',
    options: () => ({
      refetchQueries: [{ query: documents }],
      onCompleted: () => {
        Bert.alert('Tâche ajoutée!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(updateDocumentMutation, {
    name: 'updateDocument',
    options: () => ({
      refetchQueries: [{ query: documents }],
      onCompleted: () => {
        Bert.alert('Tâche réalisée!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(removeDocumentMutation, {
    name: 'removeDocument',
    options: () => ({
      refetchQueries: [{ query: documents }],
      onCompleted: () => {
        Bert.alert('Tâche supprimée!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  // }),
  // graphql(addDocument, {
  //   options: ({ history }) => ({
  //     refetchQueries: [{ query: documents }],
  //     onCompleted: (mutation) => {
  //       history.push(`/documents/${mutation.addDocument._id}/edit`);
  //     },
  //   }),
  // }),
)(Documents);
