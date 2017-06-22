import React, {Component} from 'react';

class CourseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPrice: 0,
      chapter: [],
    };
    this.addClass = this.addClass.bind(this);
    this.delPart = this.delPart.bind(this);
    this.partName = this.partName.bind(this);
    this.addCourse = this.addCourse.bind(this);
    this.upCourse = this.upCourse.bind(this);
    this.downCourse = this.downCourse.bind(this);
    this.delCourse = this.delCourse.bind(this);
  }

  addClass() {
    let chapter = this.state.chapter;
    chapter.push({ name: '', courses: [] })
    this.setState({
      chapter: chapter
    })
  }

  delPart(e) {
    if (confirm('确定删除此合辑？')) {
      let part = this.state.chapter;
      let idx = parseInt(e.target.id);
      let price = 0;
      part[idx].courses.map((val, index) => {
        price += isNaN(parseFloat(val.price)) ? 0 : parseFloat(val.price);
      });
      this.state.totalPrice -= Number(price) * 1000;
      $('.totalPrice').html(this.state.totalPrice / 1000 + '元');
      part.splice(idx, 1);
      this.setState({
        chapter: part
      })
    }
  }

  partName(e) {
    this.state.chapter[parseInt(e.target.id)].name = e.target.value;
    let chapter = this.state.chapter;
    this.setState({ chapter: chapter });
  }

  addCourse(e) {
    $('.courList').val('所有分类');
    $('.keyVal').val('');
    $('.selBtn').click();
    $('.addCourseBG').show();
    $('.addCourseBox').show();
    $('.partNum').html(e.target.id);
  }

  upCourse(aidx, idx, e) {
    if (idx != 0) {
      let item = this.state.chapter[aidx].courses[idx];
      this.state.chapter[aidx].courses[idx] = this.state.chapter[aidx].courses[idx - 1];
      this.state.chapter[aidx].courses[idx - 1] = item;
      let chapter = this.state.chapter;
      this.setState({ chapter: chapter });
    }
  }

  downCourse(aidx, idx, e) {
    if (idx != this.state.chapter[aidx].courses.length - 1) {
      let item = this.state.chapter[aidx].courses[idx];
      this.state.chapter[aidx].courses[idx] = this.state.chapter[aidx].courses[idx + 1];
      this.state.chapter[aidx].courses[idx + 1] = item;
      let chapter = this.state.chapter;
      this.setState({ chapter: chapter });
    }
  }

  delCourse(aidx, idx, e) {
    this.state.totalPrice -= Number(isNaN(parseFloat(this.state.chapter[aidx].courses[idx].price)) ? 0 : parseFloat(this.state.chapter[aidx].courses[idx].price)) * 1000;
    $('.totalPrice').html(this.state.totalPrice / 1000 + '元');
    this.state.chapter[aidx].courses.splice(idx, 1);
    let chapter = this.state.chapter;
    this.setState({ chapter: chapter });
  }

  render() {
    return (
      <tbody className="partBody">
        {
          this.state.chapter.map((aitem, aidx) => {
            let courseArr = [];
            if (aitem.courses.length > 0) {
              aitem.courses.map((val, idx) => {
                courseArr.push(
                  <tr>
                    <td>{val.name}</td>
                    <td>{val.usePeriod}月</td>
                    <td>￥{val.price}</td>
                    <td className="tdEidtor">
                      <span className="uarr arr" onClick={this.upCourse.bind(this, aidx, idx) }>&uarr; </span><span className="darr arr" onClick={this.downCourse.bind(this, aidx, idx) }>&darr; </span>
                      <span className="del"><a href="javascript: void(0)" onClick={this.delCourse.bind(this, aidx, idx) }>删除</a></span>
                    </td>
                  </tr>
                );
              })
            } else {
              courseArr.push(
                <tr>
                  <td colSpan="4">课程为空，请添加课程</td>
                </tr>
              );
            }
            let partHolder = '我是part' + (aidx + 1) + '的标题';
            return (
              <tr>
                <td ref='partId'>Part{aidx + 1}</td>
                <td>
                  <div className="partHead">
                    <span className="partTitle"><input id={aidx} onChange={this.partName} defaultValue={aitem.name} value={aitem.name} type="text" placeholder={partHolder} /></span>
                    <div id={aidx} className="delCourse" onClick={this.delPart}>删除分类</div>
                    <div id={aidx} className="addCourse" onClick={this.addCourse}>添加课程</div>
                    <div className="clear"></div>
                  </div>
                  <div className="partCourse">
                    <table className="partCL">
                      <tbody>
                        <tr>
                          <td>课程名称</td>
                          <td>课程有效期</td>
                          <td>价格</td>
                          <td>操作</td>
                        </tr>
                        {courseArr}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            )
          })
        }

        <tr>
          <td></td>
          <td>
            <div className="addClass" onClick={this.addClass}>添加分类</div>
          </td>
        </tr>
      </tbody>
    );
  }
}
export default CourseList;