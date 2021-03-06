import React, {useState, useEffect} from 'react';
import './Cards.css';
import axios from 'axios';
import CardItem from './CardItem';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

// const URL = "http://127.0.0.1:8000";
const URL = "https://itss-movie-review.herokuapp.com";

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiPagination-ul': {
      justifyContent: 'center',
    }
  },
}));

function Cards() {
  const classes = useStyles();
  const [movies, setMovies] = useState([]); // all movies
  const [cards, setCards] = useState([]); // movies show on each page
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMovies = async(url) => {
    await axios.get(url).then(response => {
      setMovies(response.data);
      setCards(response.data.slice(0, 6));
    }).catch(e => {
      console.log(e);
    })
  }

  useEffect(() => {
    fetchMovies(`${URL}/api/movies/`);
    if (movies && loading) setLoading(false);
  }, []);

  const handleOnChange = (e, pageNum) => {
    var splicedList = movies.slice((pageNum-1)*6, (pageNum-1)*6 + 6);
    setCards(splicedList);
    setPage(pageNum);
  }

  return (
    <div className='cards'>
      <h1>Check out these EPIC Movies!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {loading ? (
              <p>Loading...</p>
            ) : (
              cards ? cards.map((card) => <CardItem key={card.id} {...card} />) : null
            )}
          </ul>
        </div>
      </div>
      <Pagination className={classes.root} count={movies?Math.ceil(movies.length/6):null} page={page} size={'large'} variant="outlined" color="secondary"  onChange={handleOnChange} />
    </div>
  );
}

export default Cards;