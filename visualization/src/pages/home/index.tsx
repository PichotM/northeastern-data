import React, { useState } from 'react';
import { Menu, Segment } from 'semantic-ui-react'
import './Home.scss'

const availableSources = [
    {
        name: 'NUCareers',
        thumbnails: 'https://i.imgur.com/tEsu68Y.png'
    },
    {
        name: 'NUBanner',
        thumbnails: 'https://i.imgur.com/9oLDZny.png'
    },
    {
        name: 'Reddit',
        thumbnails: 'https://i.imgur.com/rFwIlqH.png'
    },
]

const ProjectButton: React.FC = () => {
    const [source, setSource] = useState(0);

    const changeSource = (sourceName: any) => {
        const sourceIndex = availableSources.findIndex((e) => e.name === sourceName.target.text)
        console.log(sourceIndex)
        if (sourceIndex !== -1) {
            setSource(sourceIndex);
        }
    }

    return (
        <div className="project-button">
            <Menu pointing>
                {availableSources.map((value, key) => <Menu.Item key={key} onClick={changeSource} name={String(key)} active={key === source}>{value.name}</Menu.Item>)}
            </Menu>
        
            <Segment>
                <div className="project-button-segment-image" style={{ backgroundImage: 'url(' + availableSources[source].thumbnails + ')' }} />
            </Segment>
        </div>
    )
}

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <div className="home-project-container">
                <span className="home-big-text">Play with NEUData.</span>
            
                <div className="home-project-list">
                    <ProjectButton />
                </div>
            </div>
        </div>
    )
}

export default Home;