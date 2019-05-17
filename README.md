# adapt-scenario  

<img src="assets/scenario.gif" alt="scenario" align="right" height="400px">

A scenario component. In progress... please do not use it until first release publishes.

### Installation
First, be sure to install the [Adapt Command Line Interface](https://github.com/cajones/adapt-cli), then from the command line run:-

    adapt install scenario

Or, download the ZIP and extract into the src > extensions directory and run an appropriate Grunt task.

### Demo

https://kunjsharma.github.io/#/id/co-00

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**_component** (string): This value must be: `scenario`.

**_animation** (boolean): Animation required or not.

**_delay** (string): Time interval between frames (ms).

**_navigation** (string): linear or random.

**_bg** (string): Background image. Required to display component correctly in responsive.

**_items** (array): Contains values for **_graphic** and **_highlight** for each animation frame.

**_hotspots** (array): Sets dimension, position, border radius and label.

**_feedback** (array): Notify popup text (opens when click on hotspot).

### Limitations

Compatiblity issue with authoring tool, ok with framework.

### Browser/platform specification

Intended to develop standard Adapt browser/devices specifications.

----------------------------
**Version number:**  0.0.1  
**Framework versions:** ^2.0.3  
**Author/maintainer:** Kunj B Sharma <kunjsharma@hotmail.com>  
