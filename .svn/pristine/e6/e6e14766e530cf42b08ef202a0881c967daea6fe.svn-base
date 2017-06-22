import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import './auth.css';
import myNotify from 'js/common/MyNotify';

//-----------------------ModuleChecker-----------------------------------------
class ModuleChecker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedModules: [...this.props.checkedModules],
      checkedRights: [...this.props.checkedRights],
    };
  }  

  componentWillReceiveProps(nextProps) {
    const {checkedModules, checkedRights} = nextProps;

    this.setState({
      checkedModules : checkedModules || [],
      checkedRights : checkedRights || [],
    });
  }

  getCheckedModules() {
    return this.state.checkedModules;
  }

  getCheckedRights() {
    return this.state.checkedRights;
  }

  toggleModule(moduleCode) {

    const {moduleRange} = this.props;

    if (moduleRange !== 'role') {
      let checkedModules = [...this.state.checkedModules];

      if (checkedModules.includes(moduleCode)) {
        _.pull(checkedModules, moduleCode);
      } else {
        checkedModules.push(moduleCode);
      }

      this.setState({checkedModules});

    } else {
      let checkedRights = [...this.state.checkedRights];

      if (_.find(checkedRights, {moduleCode})) {
        checkedRights = checkedRights.filter(r => r.moduleCode !== moduleCode);
      } else {
        checkedRights.push({
          moduleCode,
          operations:[],
          viewFellowData: false,
          editFellowData: false,
        });
      }

      this.setState({checkedRights});
    }
  }

  getModuleClassName(moduleCode) {
    const {moduleRange} = this.props;
    const {checkedModules, checkedRights} = this.state;
    let className = '';

    if (moduleRange !== 'role') {
      if (checkedModules.includes(moduleCode)) {
        className = 'checkedNow';
      }
    } else {
      if (_.find(checkedRights, {moduleCode})) {
        className = 'checkedNow';
      }
    }

    return className;
  }

  getOprClassName(mod, opr) {
    const {checkedRights} = this.state;
    let className = '';

    let right = _.find(checkedRights, {moduleCode: mod.moduleCode});

    if (!right) {
      return className;
    }

    if (right.operations.includes(opr)) {
      return 'checkedNow';
    }

    return className;
  }

  toggleOpr(mod, opr) {
    let checkedRights = [...this.state.checkedRights];
    let right = _.find(checkedRights, {moduleCode: mod.moduleCode});

    if (!right) {
      checkedRights.push({
        moduleCode: mod.moduleCode,
        operations: [opr],
        viewFellowData: false,
        editFellowData: false,
      });
    } else {
      if (right.operations.includes(opr)) {
        _.pull(right.operations, opr);
      } else {
        right.operations.push(opr);
      }
    }

    this.setState({checkedRights});
  }

  genOperations(mod, key) {
    const {allRights} = this.props;
    const {checkedRights} = this.state;
    let result = [];

    mod.operations.map((opr, idx) => {
      result.push(
        <a 
          key={idx}
          href="#" 
          className={this.getOprClassName(mod, opr.code) + ' narrow'} 
          onClick={this.toggleOpr.bind(this, mod, opr.code)}
        >{opr.name}</a>
      );
    });

    return (
      <td key={key}>
        {result}
      </td>
    );
  }

  getDatarangeClassName(range, mod) {
    const {checkedRights} = this.state;
    let className = '';

    let right = _.find(checkedRights, {moduleCode: mod.moduleCode});

    if (!right) {
      return className;
    }

    if (range === 'view' && right.viewFellowData) {
      return 'checkedNow';
    }

    if (range === 'edit' && right.editFellowData) {
      return 'checkedNow';
    }

    return className;
  }

  toggleDatarange(range, mod) {
    let checkedRights = [...this.state.checkedRights];
    let right = _.find(checkedRights, {moduleCode: mod.moduleCode});

    if (!right) {
      checkedRights.push({
        moduleCode: mod.moduleCode,
        operations: [],
        viewFellowData: range === 'view' ? true : false,
        editFellowData: range === 'edit' ? true : false,
      });
    } else {
      if (range === 'view') {
        right.viewFellowData = !right.viewFellowData;
      }
      if (range === 'edit') {
        right.editFellowData = !right.editFellowData;
      }
    }

    this.setState({checkedRights});
  }

  genDataRange(mod, key) {
    let result = [];

    result.push(
      <a 
        href="#" 
        key={1}
        className={this.getDatarangeClassName('view', mod) + ' narrow'} 
        onClick={this.toggleDatarange.bind(this, 'view', mod)}
        >查看同级</a>
    );

    result.push(
      <a 
        href="#" 
        key={2}
        className={this.getDatarangeClassName('edit', mod) + ' narrow'} 
        onClick={this.toggleDatarange.bind(this, 'edit', mod)}
        >操作同级</a>
    );

    return (
      <td key={key}>
        {result}
      </td>
    );
  }

  render() {
    const {moduleRange, allRights} = this.props;

    let headCols = ['组', '模块'];
    if (moduleRange === 'role') {
      headCols.push('扩展权限');
      headCols.push('数据范围');
    }

    let trs = [];
    allRights.map((grp, grpIdx) => {
      if (!grp.modules.length) {
        return;
      }
      grp.modules.map((mod, modIdx) => {
        let tds = [];
        let keyBase = `${grpIdx}-${modIdx}-`;

        if (modIdx === 0) {
          tds.push(
            <td rowSpan={grp.modules.length} key={keyBase + '0'}>{grp.groupName}</td>
          );
        }

        tds.push(
          <td key={keyBase + '1'}>
            <a 
              href="#" 
              className={this.getModuleClassName(mod.moduleCode)} 
              onClick={this.toggleModule.bind(this, mod.moduleCode)}
            >{mod.moduleName}</a>
          </td>
        );

        if (moduleRange === 'role') {
          tds.push(this.genOperations(mod, keyBase + '2'));
          tds.push(this.genDataRange(mod, keyBase + '3'));
        }

        trs.push(<tr key={keyBase}>{tds}</tr>);
      });
    });

    return (
      <div>
        <table className="authTable">
          <thead>
            <tr>
              {
                headCols.map((col, idx) => {
                  return <td key={'head-' + idx} className="text-center show-grid-bkg">{col}</td>;
                })
              }
            </tr>
          </thead>
          <tbody>
            {trs}
          </tbody>
        </table>
      </div>
    );
  }
}

ModuleChecker.propTypes = { 
  allRights: React.PropTypes.arrayOf(React.PropTypes.object),
  checkedModules: React.PropTypes.arrayOf(React.PropTypes.string),
  checkedRights: React.PropTypes.arrayOf(React.PropTypes.object),
  moduleRange: React.PropTypes.string, // 'platform' | 'company' | 'role'
};

//-----------------------ModuleCheckerContainer--------------------------------
class ModuleCheckerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allRights: [],
      checkedModules: this.props.checkedModules || [],
      checkedRights: this.props.checkedRights || [],
    };
  }  

  getCheckedModules() {
    return this.refs.moduleChecker.getCheckedModules();
  }

  getCheckedRights() {
    return this.refs.moduleChecker.getCheckedRights();
  }

  extractModuleDetail(right) {
    return {
      moduleCode: right.moduleCode,
      moduleName: right.moduleName,
      operations: right.operations,
      viewFellowData: right.viewFellowData,
      editFellowData: right.editFellowData,
    };
  }

  tidyRights(rawRights) {
    let result = [];

    rawRights.map((right) => {
      let preGroup = _.find(result, {groupCode: right.groupCode});
      if (!preGroup) {
        result.push({
          groupCode: right.groupCode,
          groupName: right.groupName,
          modules: [this.extractModuleDetail(right)],
        });
        return;
      }

      let preModule = _.find(preGroup.modules, {moduleCode: right.moduleCode});
      if (!preModule) {
        preGroup.modules.push(this.extractModuleDetail(right));
        return;
      }
    });

    return result;
  }

  componentWillReceiveProps(nextProps) {
    const {checkedModules} = nextProps;

    this.setState({
      checkedModules : checkedModules || [],
    });
  }

  componentDidMount() {
    let url = '/rights';
    if (this.props.moduleRange !== 'platform') {
      url = '/rights/company';
    }

    $.ajax({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      url: url,
      type: 'GET',
      success: (data) => {
        if (data.error) {
          myNotify.warn('保存失败');
          console.log('保存失败:', data.error);
          return;
        }

        this.setState({
          allRights: this.tidyRights(data),
        });
      },
      error: function(err) {
        myNotify.warn('获取数据失败');
        console.log('获取数据失败:', err);
      }
    });
  }

  render() {
    console.log('checkedModules=', this.state.checkedModules);
    return (
      <ModuleChecker 
        ref='moduleChecker' 
        allRights={this.state.allRights} 
        checkedModules={this.state.checkedModules}
        checkedRights={this.state.checkedRights}
        moduleRange={this.props.moduleRange}
      />
    );
  }
}

ModuleCheckerContainer.propTypes = { 
  checkedModules: React.PropTypes.arrayOf(React.PropTypes.string),
  checkedRights: React.PropTypes.arrayOf(React.PropTypes.object),
  moduleRange: React.PropTypes.string, // 'platform' | 'company'
};

export default ModuleCheckerContainer;

