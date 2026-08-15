import '../css/MovieCard.css'
import { useMovieContext } from '../context/MovieContext';

function MovieCard ({movie}){
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()
    const favorite = isFavorite(movie.id)
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null

    function onFavoriteClick(e){
        e.preventDefault()
        e.stopPropagation()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    return (
        <div className='movie-card'>
            <div className='movie-poster'>
                {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title} loading="lazy" />
                ) : (
                    <div className='poster-placeholder'>🎬</div>
                )}
                {rating && <div className='rating-badge'>⭐ {rating}</div>}
                <div className='movie-overlay'>
                    <button className={`favorite-btn ${favorite ? 'active' : ''}`}
                        onClick={onFavoriteClick} aria-label="Toggle favorite">
                        {favorite ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
            <div className='movie-info'>
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split('-')[0] || 'N/A'}</p>
            </div>
        </div>
    );
}

export default MovieCard