import React, { PureComponent } from 'react';
import './searchInput.css';
const axios = require('axios').default;
const KEY = "AIzaSyCdAyM0BPNci5bzTAuRzDVkYLSvCPLKECI";
const SEARCHENGINEID = "018264299595958242005:dvs2adlrsca";
const API_URL = "https://www.googleapis.com/customsearch/v1";



class SearchInput extends React.PureComponent {
    debounce = null;
    state = {
        serachTextValue: '',
        results: [],
        start: 0,
        resultssize: 0
    }
    render() {
        return (
            <div>
                <div className="searchInput">
                    <input type="text" onChange={this.onValueChange} />
                </div>
                {this.getSearchResultsUi()}
                {this.getPaginationUI()}
            </div>
        );
    }

    getSearchResultsUi = () => {
        const { results } = this.state;
        return (
            <div>
                {results.map((item, index) =>(
                    <div key={item.title + index} className="itemparent">
                        <div className="itemleft">
                            <img src={item.pagemap.cse_image[0].src} className="itemimg"/>
                        </div>
                        <div className="itemright">
                            <a href={item.formattedUrl}>{item.formattedUrl}</a>
                            <div className="titleText">{item.title}</div>
                            <div className="descText">{item.snippet}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    getPaginationUI = () => {
        const { resultssize, start } = this.state;
        const pages = Math.round(resultssize / 5);
        const pageDivs = [];
        for(let i= 1; i <= pages; i ++) {
            pageDivs.push(<div key={i} className={"pageitem"}onClick={() => this.onPageClick(i)}>{i}</div>);
        }
        return (<div className="pageparent">
            {pageDivs}
        </div>)
    }

    onPageClick = (page) => {
        this.getResults(this.state.serachTextValue, page -1);
    }
    onValueChange = ({ target }) => {
        this.setState({ serachTextValue: target.value });
        if(this.debounce) {
            clearTimeout(this.debounce);
        }
        this.debounce = setTimeout(()=>this.getResults(target.value), 500);
    }

    getResults = (searchTerm, page=0) => {
        const { start } = this.state;
        axios.get(`${API_URL}?key=${KEY}&cx=${SEARCHENGINEID}&q=${searchTerm}&num=5&start=${page}`)
            .then((response)=>{
                if (response.data && response.data.items) {
                    this.setState({ results: response.data.items, resultssize: response.data.searchInformation.totalResults });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export default SearchInput;
