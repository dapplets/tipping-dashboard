import React, { lazy } from 'react'
import PropTypes from 'prop-types'
import * as NearApiJs from 'near-api-js'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
import {
  // CRow,
  // CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
// import { getStyle } from '@coreui/utils'
import { CChartBar } from '@coreui/react-chartjs'
// import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

// import avatar1 from 'src/assets/images/avatars/1.jpg'
// import avatar2 from 'src/assets/images/avatars/2.jpg'
// import avatar3 from 'src/assets/images/avatars/3.jpg'
// import avatar4 from 'src/assets/images/avatars/4.jpg'
// import avatar5 from 'src/assets/images/avatars/5.jpg'
// import avatar6 from 'src/assets/images/avatars/6.jpg'
import { getDates, groupAndSum, gte, findCumulativeSum, groupAndSumScalar } from 'src/helpers.js'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

class Dashboard extends React.Component {
  static get propTypes() {
    return {
      data: PropTypes.any,
    }
  }

  render() {
    const data = this.props.data

    const dates = getDates(new Date('2021-12-01'), new Date()).map((x) =>
      x.toISOString().substring(0, 10),
    )
    const groupedTransfers = groupAndSum(data.transfers, 'date', 'amount')
    const tipsAmountValues = dates.map((x) =>
      Number(NearApiJs.utils.format.formatNearAmount(groupedTransfers[x]?.sum ?? '0')),
    )
    const tipsAmountAccValues = findCumulativeSum(tipsAmountValues)

    const tipCountsValues = dates.map((x) => groupedTransfers[x]?.count ?? 0)

    const groupedRequests = groupAndSum(data.requests, 'date')
    const requestValues = dates.map((x) => groupedRequests[x]?.count ?? 0)

    const groupedUniqueUsers = groupAndSum(data.uniqueUsers, 'date')
    const uniqueUsersValues = dates.map((x) => groupedUniqueUsers[x]?.count ?? 0)
    const uniqueUsersAccValues = findCumulativeSum(uniqueUsersValues)

    const groupedUsersActivity = groupAndSum(data.usersActivity, 'date')
    const usersActivityValues = dates.map((x) => groupedUsersActivity[x]?.count ?? 0)
    const activeUsersToday = usersActivityValues[usersActivityValues.length - 1]

    const totalUsersToday = uniqueUsersAccValues[uniqueUsersAccValues.length - 1]
    const totalUsersYesterday = uniqueUsersAccValues[uniqueUsersAccValues.length - 2]
    const usersPercent = ((totalUsersToday / totalUsersYesterday - 1) * 100).toFixed(1)

    const totalTipsAmountToday = tipsAmountAccValues[tipsAmountAccValues.length - 1]
    const totalTipsAmountYesterday = tipsAmountAccValues[tipsAmountAccValues.length - 2]
    const tipsPercent = ((totalTipsAmountToday / totalTipsAmountYesterday - 1) * 100).toFixed(1)

    const contractBalance = Number(NearApiJs.utils.format.formatNearAmount(data.contractBalance))
    const percentLocked = ((contractBalance / totalTipsAmountToday) * 100).toFixed(1)

    return (
      <>
        <CRow>
          <CCol sm={6} lg={3}>
            <CWidgetStatsA
              className="mb-4"
              color="primary"
              value={
                <>
                  {totalUsersToday + ' '}
                  <span className="fs-6 fw-normal">
                    ({usersPercent}%{' '}
                    {usersPercent > 0 ? (
                      <CIcon icon={cilArrowTop} />
                    ) : (
                      <CIcon icon={cilArrowBottom} />
                    )}
                    )
                  </span>
                </>
              }
              title="Unique Users"
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: dates.slice(dates.length - 7),
                    datasets: [
                      {
                        label: 'Users',
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: getStyle('--cui-primary'),
                        data: uniqueUsersAccValues.slice(dates.length - 7),
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        // min: 30,
                        // max: 89,
                        display: false,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 1,
                        tension: 0.4,
                      },
                      point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              }
            />
          </CCol>
          <CCol sm={6} lg={3}>
            <CWidgetStatsA
              className="mb-4"
              color="info"
              value={<>{activeUsersToday}</>}
              title="Active Users Today"
              style={{ height: '162.78px' }}
            />
          </CCol>
          <CCol sm={6} lg={3}>
            <CWidgetStatsA
              className="mb-4"
              color="warning"
              value={
                <>
                  {totalTipsAmountToday.toFixed(4) + ' $NEAR '}
                  <span className="fs-6 fw-normal">
                    ({tipsPercent}%{' '}
                    {tipsPercent > 0 ? (
                      <CIcon icon={cilArrowTop} />
                    ) : (
                      <CIcon icon={cilArrowBottom} />
                    )}
                    )
                  </span>
                </>
              }
              title="Tips Amount"
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: dates.slice(dates.length - 7),
                    datasets: [
                      {
                        label: 'Tips amount',
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: getStyle('--cui-warning'),
                        data: tipsAmountAccValues.slice(tipsAmountAccValues.length - 7),
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        // min: -9,
                        // max: 39,
                        display: false,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 1,
                      },
                      point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              }
            />
          </CCol>
          <CCol sm={6} lg={3}>
            <CWidgetStatsA
              className="mb-4"
              color="danger"
              value={
                <>
                  {contractBalance.toFixed(4) + ' $NEAR '}
                  <span className="fs-6 fw-normal">({percentLocked}%)</span>
                </>
              }
              title="Tokens not withdrawn"
              style={{ height: '162.78px' }}
            />
          </CCol>
        </CRow>

        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <h5 id="traffic" className="card-title mb-0">
                Cumulative unique users
              </h5>
            </CRow>
            <CChartLine
              style={{ height: '300px', marginTop: '40px' }}
              data={{
                labels: dates,
                datasets: [
                  {
                    label: 'Users',
                    backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                    borderColor: getStyle('--cui-info'),
                    pointHoverBackgroundColor: getStyle('--cui-info'),
                    borderWidth: 2,
                    data: uniqueUsersAccValues,
                    // fill: true,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                  y: {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <h5 id="traffic" className="card-title mb-0">
                Tips amount per day, NEAR
              </h5>
            </CRow>
            <CChartLine
              style={{ height: '300px', marginTop: '40px' }}
              data={{
                labels: dates,
                datasets: [
                  {
                    label: 'Tips amount',
                    backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                    borderColor: getStyle('--cui-info'),
                    pointHoverBackgroundColor: getStyle('--cui-info'),
                    borderWidth: 2,
                    data: tipsAmountValues,
                    // fill: true,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                  y: {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <h5 id="traffic" className="card-title mb-0">
                Tips, Account linkings and Active users count
              </h5>
            </CRow>
            <CChartLine
              style={{ height: '300px', marginTop: '40px' }}
              data={{
                labels: dates,
                datasets: [
                  {
                    label: 'Tips count',
                    backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                    borderColor: getStyle('--cui-info'),
                    pointHoverBackgroundColor: getStyle('--cui-info'),
                    borderWidth: 2,
                    data: tipCountsValues,
                    // fill: true,
                  },
                  {
                    label: 'Linking requests count',
                    backgroundColor: hexToRgba(getStyle('--cui-success'), 10),
                    borderColor: getStyle('--cui-success'),
                    pointHoverBackgroundColor: getStyle('--cui-success'),
                    borderWidth: 2,
                    data: requestValues,
                    // fill: true,
                  },
                  {
                    label: 'Active users',
                    backgroundColor: hexToRgba(getStyle('--cui-danger'), 10),
                    borderColor: getStyle('--cui-danger'),
                    pointHoverBackgroundColor: getStyle('--cui-danger'),
                    borderWidth: 2,
                    data: usersActivityValues,
                    // fill: true,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                  y: {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>

        <CRow>
          <CCol>
            <CCard className="mb-4">
              <CCardBody>
                <h5 id="senders" className="card-title mb-0">
                  Top Tip Senders
                </h5>
                <CTable style={{ marginTop: '15px' }}>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Account</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Count</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {Object.entries(data.senders)
                      .sort((a, b) => (gte(a[1].sum, b[1].sum) ? -1 : 1))
                      .filter((x, i) => i < 10)
                      .map((x, i) => (
                        <CTableRow key={i}>
                          <CTableDataCell>{i + 1}</CTableDataCell>
                          <CTableDataCell>
                            <a
                              href={'https://explorer.mainnet.near.org/accounts/' + x[0]}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {x[0]}
                            </a>
                          </CTableDataCell>
                          <CTableDataCell>{x[1].count}</CTableDataCell>
                          <CTableDataCell>
                            {Number(NearApiJs.utils.format.formatNearAmount(x[1].sum)).toFixed(4)}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol>
            <CCard className="mb-4">
              <CCardBody>
                <h5 id="receivers" className="card-title mb-0">
                  Top Tip Receivers
                </h5>
                <CTable style={{ marginTop: '15px' }}>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Account</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Count</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {Object.entries(data.receivers)
                      .sort((a, b) => (gte(a[1].sum, b[1].sum) ? -1 : 1))
                      .filter((x, i) => i < 10)
                      .map((x, i) => (
                        <CTableRow key={i}>
                          <CTableDataCell>{i + 1}</CTableDataCell>
                          <CTableDataCell>
                            <a
                              href={'https://twitter.com/' + x[0].replace('twitter/', '')}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {x[0].replace('twitter/', '@')}
                            </a>
                          </CTableDataCell>
                          <CTableDataCell>{x[1].count}</CTableDataCell>
                          <CTableDataCell>
                            {Number(NearApiJs.utils.format.formatNearAmount(x[1].sum)).toFixed(4)}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

export default Dashboard
