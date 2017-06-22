import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';

/**
 * 课程分类菜单React
 * @author: wac
 */
class MenuList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const menuLists = this.props.data;

    let lists = menuLists.map((list, index) => {
       return (<div key={index} className="indexmenu">
          <div className="listname">
            {list.type}：
          </div>
          <div className="list" >
            <span><a href="javascript: void(0);">全部</a></span>
            {
              list.values.map((val, idx) => {
                return (
                  <span key={idx}><a href="javascript: void(0);">{val.name}</a></span>
                );
              })
            }
          </div>


          <div className="clear"></div>
        </div>);
      });
    return (
      <div className="menuList">{lists}
      </div>
    );
  }
}
MenuList.propTypes = {

};

MenuList.defaultProps = {

};
export default MenuList;