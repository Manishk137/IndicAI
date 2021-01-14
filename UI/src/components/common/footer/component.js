import React from 'react'
import PropTypes from 'prop-types'

export default class Footer extends React.Component {
    render() {
        return (
            <footer className="sticky-footer">
                <div className="container">
                    <div className="row no-gutters">
                        <div className="col-lg-6 col-sm-6">
                            <p className="mt-1 m`b-0">&copy; Copyright 2020 <strong className="text-dark">Indic-AI</strong>. All Rights Reserved<br />

                            </p>
                        </div>
                        <div className="col-lg-6 col-sm-6 text-right">
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}