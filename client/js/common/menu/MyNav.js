import './MyNav.css';

import _ from 'lodash';
import React, { Component } from 'react';

class MyNav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            meun: this.props.nav || []
        }
    }

    componentDidMount() {
        var Accordion = function (el, multiple) {
            this.el = el || {};
            this.multiple = multiple || false;

            // Variables privadas
            var links = this.el.find('.link');
            // Evento
            links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown)
        }

        Accordion.prototype.dropdown = function (e) {
            var $el = e.data.el,
                $this = $(this),
                $next = $this.next();

            $next.slideToggle();
            $this.parent().toggleClass('open');

            if (!e.data.multiple) {
                $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
            };
        }
        var accordion = new Accordion($('#accordion'), false);

    }
    GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    subMenu(item) {
        let queryUrl = this.props.queryUrl ? this.props.queryUrl : this.GetQueryString('url');
        if (item) {
            return item.map((val, idx) => {
                let url = `${val.url}?url=${val.url}`;
                let className = {};
                if (queryUrl === val.url) {
                    className = { color: '#59c890' };
                }
                return (
                    <li key={idx}><a href={url} style={className} >{val.name}</a></li>
                );
            });
        }
    }
    link(item) {
        let queryUrl = this.GetQueryString('url');
        if (!item.url) {
            return (
                <div className="link">
                    {item.name}
                    <i className="fa fa-chevron-down">
                    </i>
                </div>
            );
        } else {
            let url = queryUrl ? `${item.url}?url=${item.url}` : item.url;
            return (
                <a href={url} className="link">
                    {item.name}
                    <i className="fa fa-chevron-right">
                    </i>
                </a>
            );
        }
    }

    render() {
        let parentdiv = null;
        let {meun} = this.state;
        let queryUrl = this.props.queryUrl ? this.props.queryUrl : this.GetQueryString('url');
        if (meun["nav"]) {
            parentdiv = meun.nav.map((val, idx) => {
                let className = "";
                let subStyle = {};
                if (val.url === queryUrl) {
                    className = "open";
                } else {
                    if (val.subMenu) {
                        let isOpen = _.findIndex(val.subMenu, (v) => {
                            return v.url === queryUrl;
                        });
                        if (isOpen !== -1) {
                            className = "open";
                            subStyle = { display: 'block' };
                        }
                    } 
                }
                return (
                    <li key={idx} className={className}>
                        {this.link(val)}
                        <ul  style={subStyle} className="submenu">
                            {this.subMenu(val.subMenu)}
                        </ul>
                    </li>
                )
            });
        }
        return (
            <div>
                <ul id="accordion" className="accordion">
                    {parentdiv}
                </ul>
            </div>
        );
    }
}

export default MyNav;