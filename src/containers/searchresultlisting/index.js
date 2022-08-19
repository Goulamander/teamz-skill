import React, {Component} from 'react';
import ResultListing from './listing';
import { useLocation } from 'react-router-dom';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const SearchResult = () => {
    const query = useQuery();
    return(
        <div className="search-result">
            <ResultListing  query={query}/>
        </div>
    );
}

export default SearchResult;