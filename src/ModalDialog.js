import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import dynamics from 'dynamics.js';
import centerComponent from 'react-center-component';

// This decorator centers the dialog
@centerComponent
export default class ModalDialog extends React.Component {
  static propTypes = {
    onClose: PropTypes.func, // required for the close button
    className: PropTypes.string, // css class in addition to .ReactModalDialog
    width: PropTypes.number, // width
    topOffset: PropTypes.number, // injected by @centerComponent
    leftOffset: PropTypes.number, // injected by @centerComponent
    margin: PropTypes.number.isRequired, // the margin around the dialog
    children: PropTypes.node,
    componentIsLeaving: PropTypes.bool,
    style: PropTypes.object,
  }
  static defaultProps = {
    width: 500,
    margin: 20,
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.componentIsLeaving && !this.props.componentIsLeaving) {
      const node = ReactDOM.findDOMNode(this);
      dynamics.animate(node, {
        scale: 1.2,
        opacity: 0,
      }, {
        duration: 300,
        type: dynamics.easeIn,
      });
    }
  }
  componentDidMount = () => {
    // Animate this node once it is mounted
    const node = ReactDOM.findDOMNode(this);

    if (document.body.style.transform == undefined) {
      node.style.WebkitTransform = 'scale(0.5)';
    } else {
      node.style.transform = 'scale(0.5)';
    }

    dynamics.animate(node, {
      scale: 1,
    }, {
      type: dynamics.spring,
      duration: 500,
      friction: 400,
    });
  }
  render = () => {
    const {
      props: {
        topOffset,
        leftOffset,
        width,
        className,
        children,
        onClose,
        margin,
        style,
        ...rest,
      },
    } = this;

    const dialogStyle = {
      ...style,
      position: 'absolute',
      marginBottom: margin,
      width: width,
      top: Math.max(topOffset, margin),
      left: leftOffset,
    };

    const divClassName = classNames('ReactModalDialog', className);

    return <div {...rest} className={divClassName} style={dialogStyle}>
      {
        onClose ?
        <a className="close-btn" onClick={onClose}/> :
        null
      }
      {children}
    </div>;
  }
}
