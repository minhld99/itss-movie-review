import {useParams} from 'react-router-dom'
import React ,{useState, useEffect} from 'react'
import axios from 'axios'
import "./Detail.css"
import ReactStars from "react-rating-stars-component";
const FEATURED_KEY = "7d6c5edae738317365e3235566d4c72d";
import CommentCard from "./CommentCard"
import { Button, Modal } from "react-bootstrap"
import { BiPencil } from 'react-icons/bi';
import { Dialog, DialogTitle, DialogContent, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    },
    dialogTitle: {
        paddingRight: '0px'
    }
}))

// const URL = "http://127.0.0.1:8000";
const URL = "https://itss-movie-review.herokuapp.com";

export default function Detail() {
    const classes = useStyles();
    const [movie, setMovie] = useState();
    const [reviews, setReviews] = useState([]);
    const {id} = useParams();
    const [myComment, setMyComment] = useState();
    const [myRating, setMyRating] = useState(0);
    const [response, setResponse] = useState('');
    const user_id = JSON.parse(localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')).id:null;

    const handleChange = (event) =>{
        setResponse('');
        setMyComment(event.target.value);
    }

    const handleChangeRating = (event) =>{
        setMyRating(event.target.value);
    }

    const formatRunTime = (runtime) => {
        const minute = runtime %60;
        const hour = (runtime -minute)/60;
        if(hour == 0) return minute+"分"
        else return hour+'時'+minute+'分';
    }

    const formatDate = (date) => {
        
        const [year, month, day] = [...date.split('-')];
        return year + '年'　+ month + '月' + day + '日';
    }

    const getYear = (date) =>{
        const arr = date.split('-');
        
        return arr[0];
    }

    const formatCategory = (genres) => {
        const listCategories = [];
        genres.map((genre) => listCategories.push(genre.name));
        return listCategories.join(', ');;
    }

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setResponse('');
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const handleAddComment = () =>{
        axios.post(`${URL}/api/reviews`, {user_id, movie_id:id, review_text:myComment, rating:myRating})
        .then( response =>{
            const listReview = [...reviews];
            listReview.push(response.data);
            setReviews(listReview);
            setResponse(response.data.message);
            handleClose();
        })
        .catch(e => {console.log(e)})
    }

    const fetchMovies = () => {
        axios.get(`${URL}/api/movies/${id}`).then(response => {
        console.log(response.data)
        let data = {...response.data}
        data.runtime = formatRunTime(data.runtime);
        data.year = getYear(data.release_date);
        data.release_date = formatDate(data.release_date);
          setMovie(data);
        }).catch(e => {
          console.log(e); 
        })
      }

    const getReview = () =>{
        axios.get(`${URL}/api/movies/${id}/reviews`)
        .then(response =>{
            // console.log(response);
            setReviews([...response.data]);
        })
        .catch(e => {
            console.log(e);
          })
    }
    const getLanguages = () =>{
        axios.get(`http://api.themoviedb.org/3/movie/${id}?api_key=${FEATURED_KEY}&language=ja-JP`)
        .then(response =>{console.log(response)})
        .catch(e => {console.log(e)})
            
    }
      useEffect(() => {
        fetchMovies();
        getReview();
        getLanguages()
      }, []);
      
     
      const firstExample = {
        size: 30,
        count:10,
        edit: false
      };
      const secondExample = {
        size: 30,
        count:10,
      }
    
    return(
        
        <React.Fragment>
            {
                movie ?
                <>
                <div className="overview-container" style= {{background:`linear-gradient(to right, rgba(5.10%, 4.71%, 4.71%, 1.00) 150px, rgba(5.10%, 4.71%, 4.71%, 0.84) 100%), url(${movie.backdrop_path})`,   backgroundRepeat: 'no-repeat', backgroundPosition:" right"}}>
                  <div className="content">
                      <section className="content1">
                          <div className="poster-block">
                              <img className = "poster" src={movie.poster_path}></img>
                          </div>
                          <div className="infor-block">
                                  <section className="infor-section">
                                      <div className="tilte-infor">
                                          <h2 className="title">{movie.title+'('+movie.year+')'}</h2>
                                          <div>{movie.release_date} (VN)・{movie.runtime}</div>
                                          <div className="rating">
                                             <div className="star"><ReactStars {...firstExample} value= {Number(movie.vote_average)} /></div>
                                             <div className="average">{Number(movie.vote_average)}/10</div>
                                          </div>
                                          <div style = {{fontStyle: 'italic', paddingBottom:'1rem'}}>{movie.tagline}</div>
                                          <h3>概要</h3>
                                          <div className="overview">
                                              <p>{movie.overview}</p>
                                          </div>
                                      </div>
                                  </section>
                              </div>
                      </section>
                  </div>
                </div>
                <div className = "comment-container">
                    <div className="content">
                        <div style = {{display:'flex'}}>
                            <div style = {{display:'flex', alignItems: 'center'}}>
                                <h2>レビュー</h2>
                                <div className = "add-comment-button"  onClick = {handleShow}><BiPencil />レビュー追加</div>
                            </div>
                            <Dialog open={show} maxWidth="md" classes={{ paper: classes.dialogWrapper }}>
                                <DialogTitle className={classes.dialogTitle}>
                                    <div style={{ display: 'flex' }}>
                                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                                            {movie ? movie.title : null}
                                        </Typography>
                                    </div>
                                </DialogTitle>
                                <DialogContent dividers>
                                    <div>Rate</div>
                                    <ReactStars {...secondExample} value={myRating} onChange={(value) =>setMyRating(value)} />
                                    <div>Content</div>
                                    <input type = "text" style ={{border: "1px solid", width:"100%", minHeight:"5rem"}} value ={myComment} onChange = {handleChange} />
                                    <div style ={{display: "flex", justifyContent: "space-around"}}>
                                        <Button variant="secondary" onClick={handleClose} style ={{margin: "1rem"}}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={handleAddComment} style ={{margin: "1rem"}}>
                                            Save Changes
                                        </Button>
                                        {response ? <h3>{response}</h3> : null}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                      <div className="white-column">
                        <section className="panel-review">
                            <div className="review-container">
                                <div className="review-content">
                                    {
                                        reviews.length > 0 ? 
                                            reviews.map((review) => <CommentCard  key = {review.id} review={review}/> )
                                                :
                                            <div className="card"><h3 style={{textAlign: "center"}}>コメントはまだありません！</h3></div>
                                    }
                                    
                                    </div>
                                </div>
                            
                        </section>
                      </div>
                    </div>
                </div>
                </>
                :null
            }
            {/* <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{movie?movie.title:null}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Rate</div>
                    <ReactStars {...secondExample} value={myRating} onChange={(value) =>setMyRating(value)} />
                    <div>Content</div>
                    <input type = "text" style ={{border: "1px solid", width:"100%", minHeight:"5rem"}} value ={myComment} onChange = {handleChange} />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleAddComment}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal> */}
        </React.Fragment>
    )
}
