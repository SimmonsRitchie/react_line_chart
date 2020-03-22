import React, { Component } from "react";
import Svg from "../Svg";
import Container from "../Container";
import { throttle } from "throttle-debounce";

function withResponsiveContainer(ChartComponent) {
  /*
   * A HOC that takes a function a component and wraps it with an SVG and
   * makes it responsive responsive container
   *
   * The D3render function returns what we want to render with d3
   */
  return class ResponsiveContainer extends Component {
    constructor(props) {
      super(props);
      this.containerRef = React.createRef();
      this.state = {
        width: 0,
        height: 0
      };
      //! Important: must bind otherwise ref will be inacessible on event listener calls
      this.resize = this.resize.bind(this);
      // * We use throttle to improve performance
      this.throttledHandleWindowResize = throttle(300, this.resize);
    }

    componentDidMount() {
      // initial sizing
      this.resize();
      // resize if window changes
      window.addEventListener("resize", this.throttledHandleWindowResize);
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.throttledHandleWindowResize);
    }

    resize() {
      const containerEl = this.containerRef.current;
      console.log(containerEl)
      const width = containerEl.getBoundingClientRect().width;
      const height = width * 0.7; // We set height as a ratio of width
      this.setState({
        width,
        height
      });
  }

    render() {
      const { width, height } = this.state;
      const margin = { top: 50, right: 50, bottom: 50, left: 50 };
      return (
        <Container ref={this.containerRef}>
          <Svg width={width} height={height}>
            <ChartComponent
              x={margin.right}
              y={margin.top}
              height={height - (margin.top + margin.bottom)}
              width={width - (margin.left + margin.right)}
              {...this.props}
            />
          </Svg>
        </Container>
      );
    }
  };
}

export default withResponsiveContainer;
