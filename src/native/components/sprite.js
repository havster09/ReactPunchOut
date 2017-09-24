import React, { Component, PropTypes } from "react";

import { View, Image } from "react-native";

export default class Sprite extends Component {
  static propTypes = {
    offset: PropTypes.array,
    onPlayStateChanged: PropTypes.func,
    onUpdateStepCount: PropTypes.func,
    repeat: PropTypes.bool,
    cancelNextFrame: PropTypes.bool,
    scale: PropTypes.number,
    direction: PropTypes.number,
    src: PropTypes.number,
    state: PropTypes.number,
    steps: PropTypes.array,
    style: PropTypes.object,
    ticksPerFrame: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    tileHeight: PropTypes.number,
    tileWidth: PropTypes.number,
    left: PropTypes.number,
    top: PropTypes.number,
  };

  static defaultProps = {
    offset: [0, 0],
    onPlayStateChanged: () => {},
    onUpdateStepCount: () => {},
    repeat: true,
    src: "",
    state: 0,
    steps: [],
    direction: 1,
    ticksPerFrame: 4,
    tileHeight: 64,
    tileWidth: 64
  };

  static contextTypes = {
    loop: PropTypes.object,
    scale: PropTypes.number
  };
  constructor(props) {
    super(props);
    this.loopID = null;
    this.tickCount = 0;
    this.finished = false;
    this.state = {
      currentStep: 0
    };
  }

  componentDidMount() {
    this.props.onPlayStateChanged(1);
    const animate = this.animate.bind(this, this.props);
    this.loopID = this.context.loop.subscribe(animate);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.state !== this.props.state
     || nextProps.direction !== this.props.direction
     || nextProps.ticksPerFrame !== this.props.ticksPerFrame) {
      this.finished = false;
      this.props.onPlayStateChanged(1);
      this.context.loop.unsubscribe(this.loopID);
      this.tickCount = 0;

      this.setState(
        {
          currentStep: 0
        },
        () => {
          const animate = this.animate.bind(this, nextProps);
          this.loopID = this.context.loop.subscribe(animate);
        }
      );
    }
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.loopID);
  }

  animate(props) {
    const { repeat, state, steps, cancelNextFrame } = props;
    let ticksPerFrame = props.ticksPerFrame;

    if(state !== 0) {
      const { currentStep } = this.state;
      if(typeof ticksPerFrame === 'object') {
        ticksPerFrame = ticksPerFrame[currentStep]
      }
      if (this.tickCount === ticksPerFrame && !this.finished) {
        const lastStep = steps[state];
        let nextStep = currentStep === lastStep ? 0 : currentStep + 1;

        if (!repeat && currentStep > nextStep) {
          nextStep = currentStep;
        }

        this.props.onUpdateStepCount(currentStep);

        this.setState({
          currentStep: nextStep
        });

        if (currentStep === lastStep && repeat === false || cancelNextFrame) {
          // todo figure out how to finish without last step
          this.finished = true;
          this.props.onPlayStateChanged(0);
        }

        this.tickCount = 0;
      } else {
        this.tickCount++;
      }
    }
  }

  getImageStyles() {
    const { currentStep } = this.state;
    const { state, tileWidth, tileHeight } = this.props;

    const left = this.props.offset[0] + currentStep * tileWidth;
    const top = this.props.offset[1] + state * tileHeight;

    return {
      position: "absolute",
      transform: [{ translateX: left * -1 }, { translateY: top * -1 }],
    };
  }

  getWrapperStyles() {
    const { left, top} = this.props;
    const scale = this.props.scale || this.context.scale;
    const scaleX = this.props.direction > 0 ? scale : -Math.abs(scale);
    return {
      height: this.props.tileHeight,
      width: this.props.tileWidth,
      overflow: "hidden",
      position: "absolute",
      transform: [{ scaleX }, { scaleY: scale }],
      left,
      top,
    };
  }

  render() {
    return (
      <View style={{ ...this.getWrapperStyles(), ...this.props.style }}>
        <Image style={this.getImageStyles()} source={this.props.src} />
      </View>
    );
  }
}
