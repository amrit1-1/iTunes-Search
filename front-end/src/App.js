import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import selectFav from './images/favourite.png';
import deleteIcon from './images/delete.png';

const App = () => {
// States to store the token, selected media-type, user input, search results from API, and user's favourite content
  const [token, setToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [results, setResults] = useState([]);
  const [favourites, setFavourites] = useState([]);

  // Generates a token when application first loads
  // Replace URL with localhost URL if running on local device
  const getToken = async () => {
    const response = await axios.get('https://itunes-search-backend.onrender.com/api/token'); 
    setToken(response.data.token);
  };

  useEffect(() => {
      getToken();
  }, []);

  // Function that grabs the search term from user input, media type from the selection, and responds with the relevant results.
  // Replace URL localhost url if running on local device
  const handleSearch = async () => {
    if (!token) return;
    const response = await axios.get('https://itunes-search-backend.onrender.com/api/search', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            term: searchTerm,
            media: mediaType
        }
    });
    console.log('Response Data:', response.data.results);
    setResults(response.data.results);
    // Putting the input back to being empty
    setSearchTerm('');
  };

  // Function that adds to the favourites array with the specific item
  const addToFavourites = (item) => {
    setFavourites([...favourites, item]);
    console.log(item);
  };

  // Function that removes the specific item from the favourites array
  const removeFromFavourites = (item) => {
    setFavourites(favourites.filter(fav => fav.trackId !== item.trackId));
  };

  return (
    <div className="App">
      <h1 className="page-title">Media Browser</h1>
      <p>Search through our extensive catalogue of media and add anything you like to your Favourites!</p>

      {/* User input field which is used as the search term when contacting the API */}
      <div>
        <input
          type="text"
          required
          className='input'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
        />

        {/* Dropdown menu which is used to select the media-type */}
        <select 
          value={mediaType} 
          className='select'
          onChange={(e) => setMediaType(e.target.value)}>
          <option value="all">All</option>
          <option value="music">Music</option>
          <option value="musicVideo">Music Videos</option>
          <option value="movie">Movies</option>
          <option value="podcast">Podcasts</option>
          <option value="audiobook">Audiobooks</option>
          <option value="tvShow">TV Shows</option>
          <option value="software">Software</option>
          <option value="ebook">eBooks</option>
        </select>

        <button 
          className='button'
          onClick={handleSearch}>Search
        </button>
      </div>

      <hr />

      {/* The following Container element holds the results which are mapped after the user has pressed 'search'.*/}
      <Container>
        <Row>
          <Col>
            <div className='divide'>
              <h2>Results</h2>
                {(results.length > 0) ? 
                  <>
                    { // If no results are found, a message appears informing the user of this.
                    results.map((result) => (
                      <Row key={result.trackId || result.collectionId || result.trackName} className='result'>
                        <Col>
                          <div className='container'>
                            <img className='img' src={result.artworkUrl100} alt={result.collectionName || result.trackName || result.trackCensoredName}/>
                          </div>
                        </Col>

                        <Col>
                          <div className="result-info">
                            <p className="bold">{result.collectionName || result.trackName || result.trackCensoredName || result.title}</p>
                            <p>By {result.artistName}</p>
                            <p>Released: {new Date(result.releaseDate).toLocaleDateString()}</p>
                          </div>
                        </Col>

                        <Col>
                          <div className="centering">
                            <button className='favourite' onClick={() => addToFavourites(result)}>
                              <img className='fav-icon' src={selectFav} alt="Add to Favourites"/>
                            </button>
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </> : <p>No results found</p>}
            </div>
          </Col>

          {/* If a user hasn't favourited anything yet, the 'Favourites' element does not appear */}
          {(favourites.length > 0) ? 
            <Col>
              <div className='divide'>
                <h2>Favourites</h2>
                  {favourites.map((fav) => (
                    <Row key={fav.trackId || fav.collectionId || fav.trackName} className='fav-result'>
                      <Col>
                        <div className='container'>
                          <img className='img' src={fav.artworkUrl100} alt={fav.collectionName || fav.trackName || fav.trackCensoredName} />
                        </div>
                      </Col>

                      <Col>
                        <div className='result-info'>
                          <p className="bold">{fav.collectionName || fav.trackName || fav.trackCensoredName}</p>
                          <p>By {fav.artistName}</p>
                          <p>Released: {new Date(fav.releaseDate).toLocaleDateString()}</p>
                        </div>
                      </Col>

                      <Col>
                        <div className='centering'>
                          <button className='delete' onClick={() => removeFromFavourites(fav)}>
                            <img className='fav-icon' src={deleteIcon}/>
                          </button>
                        </div>
                      </Col>
                    </Row>
                  ))}
              </div>
            </Col>
          : null}
        </Row>
      </Container>
    </div>
  );
};

export default App;
