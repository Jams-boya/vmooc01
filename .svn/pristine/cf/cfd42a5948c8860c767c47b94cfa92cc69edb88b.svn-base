/** 专题页面--课程显示 
 *  @author wac 
 */

import React, { Component } from 'react';
import ReactDom from 'react-dom';

class CoursesReact extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let chapter = this.props.chapter;
    let chapterArr = [];
    chapter.chapter.map((chapter, index) => {
      let courseArr = [];
      chapter.courses.map((courses, idx) => {
        if(!courses.favoriteCount || courses.favoriteCount == '') {
          courses.favoriteCount = 0;
        }
        let courseLink = '/course/' + courses.id;
        courseArr.push(
          <a key={idx} href={courseLink} target="_blank">
            <div className="course">
              <div className="courseImg">
                <div className="courseTB">
                  <table className="imgTitle">
                    <tbody>
                      <tr>
                        <td>{courses.name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <img src={courses.cover} />
              </div>
              <div className="courseRight">
                <span className="courseName">{courses.name}</span>
                <div className="courseCon">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          {courses.description}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="courselike">
                  <span className="like">{courses.favoriteCount}</span> 人感兴趣
                </div>
              </div>

              <div className="clear"></div>
            </div>
          </a>
        );
      });
      let courseClass1 = 'courseAll courseDiv1';
      let courseClass2 = 'coursetop1';
      let colors = 'red';
      if (index % 3 == 0) {
        colors = '#3bbfe6';
      }
      if (index % 3 == 1) {
        colors = '#0abe85';
      }
      if (index % 3 == 2) {
        colors = '#fab829';
      }
      if ((index + 1) % 2 == 0) {
        courseClass1 = 'courseAll courseDiv2';
        courseClass2 = 'coursetop2';
      } else {
        courseClass1 = 'courseAll courseDiv1';
        courseClass2 = 'coursetop1';
      }
      chapterArr.push(
        <div key={chapterArr.length} className={courseClass1}>
          <div className="rubottom"></div>
          <div className="couseboder">
            <div className="rutop"></div>
          </div>
          <div className={courseClass2}>
            <div className="ctopbg">
              <span className="partTitle" style={{ 'color': colors }}>
                {chapter.name}
              </span>
              <img src="/img/special/tail.png" />
              <div className="clear"></div>
            </div>
            <div className="partA" style={{ 'borderColor': colors }}>
              <div className="partB" style={{ 'borderColor': colors }}>
                <div className="partC" style={{ 'background': colors }}>
                  Part{index + 1}
                </div>
              </div>
            </div>
          </div>

          <div className="courselist">
            {courseArr}
          </div>
        </div>
      );
    });
    return (
      <div className="courses">
        {chapterArr}
      </div>
    );
  }
}

export default CoursesReact;