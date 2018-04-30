import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getMediaForCollection } from '../../actions'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCaretLeft from '@fortawesome/fontawesome-free-solid/faCaretLeft'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown'

import Collection from './Collection'

class SeriesCollection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      expanded: props.index === 0
    }
    this.load = this.load.bind(this)
    this.toggleExpanded = this.toggleExpanded.bind(this)
  }

  async componentDidMount () {
    const { index } = this.props
    if (index === 0) {
      await this.load()
    }
  }

  async load () {
    const { dispatch, id } = this.props
    await dispatch(getMediaForCollection(id))
    this.setState({ loaded: true })
  }

  async toggleExpanded () {
    const { loaded, expanded } = this.state
    this.setState({ expanded: !expanded })
    // load if not loaded
    if (!loaded) {
      await this.load()
    }
  }

  render () {
    const { loaded, expanded } = this.state
    const { title, collectionMedia, id, perPage = 3 } = this.props
    return (
      <div className='mt-4'>
        <h4 className='border-bottom pb-3 mb-4' style={{ cursor: 'pointer', userSelect: 'none' }} onClick={this.toggleExpanded}>
          <div className='d-flex justify-content-between'>
            {title}
            <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretLeft} className='align-self-center ml-1' />
          </div>
        </h4>
        {
          expanded
            ? <Collection
              mediaIds={loaded && collectionMedia[id] ? collectionMedia[id] : []}
              loading={!loaded && !collectionMedia[id]}
              perPage={perPage}
              showTitle={false} />
            : null
        }
      </div>
    )
  }
}

export default connect((store) => {
  return {
    collectionMedia: store.Data.collectionMedia
  }
})(SeriesCollection)
