'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UITreeNode = function (_Component) {
  _inherits(UITreeNode, _Component);

  function UITreeNode(props) {
    _classCallCheck(this, UITreeNode);

    var _this = _possibleConstructorReturn(this, (UITreeNode.__proto__ || Object.getPrototypeOf(UITreeNode)).call(this, props));

    _this.renderCollapse = function () {
      var index = _this.props.index;


      if (index.children && index.children.length) {
        var collapsed = index.node.collapsed;


        return _react2.default.createElement('span', {
          className: (0, _classnames2.default)('collapse', collapsed ? 'caret-right' : 'caret-down'),
          onMouseDown: function onMouseDown(e) {
            return e.stopPropagation();
          },
          onClick: _this.handleCollapse
        });
      }

      return null;
    };

    _this.renderChildren = function () {
      var _this$props = _this.props,
          index = _this$props.index,
          tree = _this$props.tree,
          dragging = _this$props.dragging;


      if (index.children && index.children.length) {
        var childrenStyles = {
          paddingLeft: _this.props.paddingLeft
        };

        return _react2.default.createElement(
          'div',
          { className: 'children', style: childrenStyles },
          index.children.map(function (child) {
            var childIndex = tree.getIndex(child);

            return _react2.default.createElement(UITreeNode, {
              tree: tree,
              index: childIndex,
              key: childIndex.id,
              dragging: dragging,
              paddingLeft: _this.props.paddingLeft,
              onCollapse: _this.props.onCollapse,
              onDragStart: _this.props.onDragStart
            });
          })
        );
      }

      return null;
    };

    _this.handleCollapse = function (e) {
      e.stopPropagation();
      var nodeId = _this.props.index.id;

      if (_this.props.onCollapse) {
        _this.props.onCollapse(nodeId);
      }
    };

    _this.handleMouseDown = function (e) {
      e.stopPropagation();
      _this.startPos = { x: e.clientX, y: e.clientY };
      window.addEventListener("mousemove", _this.handleMouseMove);
      window.addEventListener("mouseup", function () {
        window.removeEventListener("mousemove", _this.handleMouseMove);
      });
    };

    _this.handleMouseMove = function (e) {
      if (!_this.startPos) return;

      var dom = _this.innerRef.current;
      // This happens rarely, if we catch an event in the middle of an update/render cycle.
      if (!dom) return;

      var dragThreshold = _this.props.dragThreshold;

      var deltaX = Math.abs(e.clientX - _this.startPos.x);
      var deltaY = Math.abs(e.clientY - _this.startPos.y);
      if (deltaX < dragThreshold && deltaY < dragThreshold) return;

      _this.startPos = null;

      var nodeId = _this.props.index.id;
      if (_this.props.onDragStart) {
        _this.props.onDragStart(nodeId, dom, e);
      }
    };

    _this.innerRef = _react2.default.createRef();
    return _this;
  }

  _createClass(UITreeNode, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          tree = _props.tree,
          index = _props.index,
          dragging = _props.dragging;
      var node = index.node;

      var styles = {};

      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('m-node', {
            placeholder: index.id === dragging
          }),
          style: styles
        },
        _react2.default.createElement(
          'div',
          {
            className: 'inner',
            ref: this.innerRef,
            onMouseDown: this.handleMouseDown
          },
          this.renderCollapse(),
          tree.renderNode(node)
        ),
        node.collapsed ? null : this.renderChildren()
      );
    }
  }]);

  return UITreeNode;
}(_react.Component);

UITreeNode.propTypes = {
  dragThreshold: _propTypes2.default.number
};
UITreeNode.defaultProps = {
  dragThreshold: 8
};


module.exports = UITreeNode;