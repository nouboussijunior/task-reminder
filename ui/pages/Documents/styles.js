import styled from 'styled-components';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

export const StyledListGroup = styled(ListGroup)`
  margin-bottom: 0;
`;

export const StyledListGroupItem = styled(ListGroupItem)`
  padding: 20px 10px;
  position: relative;
  overflow: hidden;
  margin: auto;
  vertical-align: middle;

  .taskItem {
    margin-top: auto;
    margin-bottom: auto;
  }

  i {
    cursor: pointer;
  }

  .deleteTask i:hover {
    color: #d9534f;
  }

  .resolvedTask i {
    color: #5cb85c;
  }

  .label {
    display: inline-block;
    position: absolute;
    bottom: -20px;
    right: -10%;
  }

  .lineThrough {
    text-decoration: line-through;
  }

  .resolveTask {
    cursor: pointer;
  }

  // &:after {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   right: 0;
  //   bottom: 0;
  //   width: 75px;
  //   display: block;
  //   background: rgb(2, 0, 36);
  //   background: linear-gradient(90deg, rgba(2, 0, 36, 0) 0%, rgba(255, 255, 255, 1) 100%);
  // }

  h3 {
    margin: 0px;
  }

  &:hover {
    background: #fafafa;

    &:after {
      display: none;
    }
  }

  a {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  p {
    margin: 0;
    white-space: nowrap;

    span:not(.label) {
      color: var(--gray-light);
      margin-left: 5px;
    }

    .label {
      display: inline-block;
      position: relative;
      top: -1px;
      right: -1px;
      margin-left: 3px;
    }
  }
`;

export const StyledDocuments = styled.div`
  header {
    margin: 0px 0 20px;
  }

  .transparent {
    color: transparent;
  }

  @media screen and (min-width: 768px) {
    header {
      margin: 0 0 20px;
    }
  }
`;

export const DocumentsList = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
  }

  @media screen and (min-width: 992px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

export const Document = styled.div`
  position: relative;
  border: 1px solid var(--gray-lighter);
  border-top: 5px solid var(--gray-lighter);
  padding: 20px;
  border-radius: 3px;
  height: 20px;
  transition: transform 0.3s ease-in-out;

  a {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  header {
    margin: 0;
  }

  h2 {
    margin: 10px 0 0;
    font-size: 16px;
    line-height: 24px;
  }

  p {
    margin: 10px 0 0;
    color: var(--gray-light);
  }

  &:hover {
    transform: scale(1.02, 1.02);
    cursor: pointer;
  }

  @media screen and (min-width: 768px) {
    &:not(:last-child) {
      margin-bottom: 0;
    }
  }
`;
