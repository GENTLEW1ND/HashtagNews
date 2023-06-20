import React, { useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useEffect } from 'react'

const News = (props) => {

  const [articles, setArticles] = useState({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResult] = useState(0)
  

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.catagory}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json()
    props.setProgress(70);
    setArticles(parsedData.article)
    setTotalResult(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100)
  }
  useEffect=(()=>{
    document.title = `${props.catagory} - HashtaNews`
    updateNews()
  },[])

//   const handleNextClick = async () => {
//     setPage(page+1)
//     updateNews()
//  }
//   const handlePreviousClick = async () => {
//   setPage(page-1)
//   updateNews()
//   }

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.catagory}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    setLoading(true)
    let data = await fetch(url);
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResult(parsedData.totalResults)

    return (
      <>
        <h1 className='text-center' style={{ margin: "35px", marginTop: "90px" }}>HashtagNews-Top {props.catagory} headlines</h1>
        {loading && <Spinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className='container'>
            <div className='row'>
              {articles.map((element) => {
                return <div className='col-md-4' key={element.url}>
                  <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className='container d-flex justify-content-between'>
          <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePreviousClick}>&larr; previous</button>
          <button disabled={page + 1 > Math.ceil(totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}>next &rarr;</button>
        </div> */}
      </>
    )
}
News.defaultProps = {
  country: "in",
  pageSize: 8,
  catagory: "General"
}
News.propsTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  catagory: PropTypes.string

}
}
export default News