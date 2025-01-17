import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import 'styled-components/macro';
import { connect } from 'react-redux';

import { withFirebase } from './Firebase';
import { withAuthentication } from './Session';
import { handleSampleData, handleFirebaseData } from '../actions/shared';
import withLeaveWarning from './withLeaveWarning';
import Header from './Header';
import Incomes from './Incomes';
import Expenses from './Expenses';
import Split from './Split';
import Report from './Report';
import Footer from './Footer';

const Column = tw.div`w-full lg:w-1/2 px-8 mb-8 lg:mb-0`;

class Home extends Component {
  componentDidUpdate(prevProps) {
    const {
      authUser,
      firebase,
      onHandleFirebaseData,
      onHandleSampleData
    } = this.props;

    if (authUser !== prevProps.authUser)
      authUser
        ? onHandleFirebaseData(authUser.uid, firebase)
        : onHandleSampleData(firebase);
  }

  render() {
    return (
      <div className="container" css={tw`py-4 lg:py-8 overflow-hidden`}>
        <Header />
        <main css={tw`flex flex-wrap -mx-8`}>
          <Column>
            <h2 css={tw`text-white text-3xl font-bold mt-8`}>
              What's your share?
            </h2>
            <p css={tw`text-white text-xl font-light max-w-md`}>
              Calculate how much you and your partner should contribute towards
              shared household expenses.
            </p>
            <Incomes />
            <Expenses />
          </Column>
          <Column>
            <div css={tw`bg-white rounded-lg shadow p-4 lg:p-8 mb-8`}>
              <Split />
              <Report />
            </div>
            <h3 css={tw`text-white text-lg font-bold mb-2`}>What now?</h3>
            <p css={tw`text-white mb-8`}>
              Talk with your partner about which method of splitting expenses
              works best for you. Once you've chosen a method, consider creating
              a shared checking account, depositing your contributions from each
              paycheck, and paying bills using your new account for complete
              automation.
            </p>
            <Footer />
          </Column>
        </main>
      </div>
    );
  }
}

Home.propTypes = {
  authUser: PropTypes.object,
  firebase: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  onHandleFirebaseData: (uid, firebase) =>
    dispatch(handleFirebaseData(uid, firebase)),
  onHandleSampleData: firebase => dispatch(handleSampleData(firebase))
});

const mapStateToProps = ({ session }) => ({
  authUser: session.authUser
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFirebase(withAuthentication(withLeaveWarning(Home))));
