import { useState, useEffect, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import { searchMovies, getPopularMovies } from "../services/api";
import '../css/Home.css'

function Home(){
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('default')

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            }
            catch (err) {
                console.log(err)
                setError('Failed to load movies...')
            }
            finally {
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, [])

    useEffect(() => {
        if (!searchQuery.trim()) {
            const loadPopularMovies = async () => {
                setLoading(true)
                try {
                    const popularMovies = await getPopularMovies()
                    setMovies(popularMovies)
                    setError(null)
                }
                catch (err) {
                    console.log(err)
                    setError('Failed to load movies...')
                }
                finally {
                    setLoading(false)
                }
            }
            loadPopularMovies()
            return
        }

        setLoading(true)
        const timeoutId = setTimeout(async () => {
            try {
                const searchResults = await searchMovies(searchQuery)
                setMovies(searchResults)
                setError(null)
            }
            catch (err) {
                console.log(err)
                setError("Failed to search movies")
            }
            finally {
                setLoading(false)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    // Sort a COPY of movies whenever the list or sort option changes
    const sortedMovies = useMemo(() => {
        const moviesCopy = [...movies]

        switch (sortBy) {
            case 'title-asc':
                return moviesCopy.sort((a, b) => a.title.localeCompare(b.title))
            case 'title-desc':
                return moviesCopy.sort((a, b) => b.title.localeCompare(a.title))
            case 'rating-desc':
                return moviesCopy.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
            case 'rating-asc':
                return moviesCopy.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0))
            case 'newest':
                return moviesCopy.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0))
            case 'oldest':
                return moviesCopy.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0))
            default:
                return moviesCopy
        }
    }, [movies, sortBy])

    return (
        <div className='home'>
            <div className='hero'>
                <h1>Ride the wave of <span className='highlight'>great movies</span></h1>
                <p>Search, discover, and save your favorites with Movie Surfer</p>
            </div>

            <div className='search-form'>
                <input type='text' placeholder='Search for movies...'
                    className='search-input' value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {!loading && movies.length > 0 && (
                <div className='sort-bar'>
                    <label htmlFor='sort-select'>Sort by:</label>
                    <select id='sort-select' className='sort-select'
                        value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value='default'>Default</option>
                        <option value='title-asc'>Title (A-Z)</option>
                        <option value='title-desc'>Title (Z-A)</option>
                        <option value='rating-desc'>Rating (High to Low)</option>
                        <option value='rating-asc'>Rating (Low to High)</option>
                        <option value='newest'>Newest First</option>
                        <option value='oldest'>Oldest First</option>
                    </select>
                </div>
            )}

            {error && <div className='error-message'>{error}</div>}

            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading movies...</p>
                </div>
            ) : sortedMovies.length > 0 ? (
                <div className='movies-grid'>
                    {sortedMovies.map((movie) =>
                        <MovieCard movie={movie} key={movie.id} />
                    )}
                </div>
            ) : (
                <div className='no-results'>
                    <h2>No movies found</h2>
                    <p>Try a different search term</p>
                </div>
            )}
        </div>
    );
}

export default Home