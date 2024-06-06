import { InfoIcon, CheckCircleIcon, WarningTwoIcon } from '@chakra-ui/icons'
import { Container, Tooltip, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import './NetworkStatus.scss'

function NetworkStatus ({ status }) {
  const msFromLastBlock = new Date() - new Date(status?.data?.latestBlock?.header?.timestamp)
  const networkStatus = msFromLastBlock && msFromLastBlock / 1000 / 60 < 15
  const apiStatus = status?.data?.apiHeight === status?.data?.tenderdashChainHeight

  const NetworkStatusIcon = networkStatus
    ? <CheckCircleIcon color={'green.500'} ml={2}/>
    : <WarningTwoIcon color={'yellow.400'} ml={2}/>

  const ApiStatusIcon = apiStatus
    ? <CheckCircleIcon color={'green.500'} ml={2}/>
    : <WarningTwoIcon color={'yellow.400'} ml={2}/>

  console.log('status', status)

  function getLastBlocktimeString () {
    if (!status?.data?.latestBlock?.header?.timestamp) return 'n/a'

    if (msFromLastBlock < 60 * 1000) {
      return `${Math.floor((msFromLastBlock / 1000))} sec. ago`
    } else {
      return `${Math.floor((msFromLastBlock / 1000) / 60)} min. ago`
    }
  }

  return (
        <Container
            className={'NetworkStatus'}
            maxW={'100%'}
            m={0}
            p={6}
            pl={6}
            h={'100%'}
            borderWidth={'1px'} borderRadius={'lg'}
        >
            <div className={`NetworkStatus__InfoItem ${status?.loading ? 'NetworkStatus__InfoItem--Loading' : ''}`}>
                <div className={'NetworkStatus__Title'}>Epoch:</div>
                <div className={'NetworkStatus__Value'}>
                    <span>{status?.data?.epoch !== undefined ? `#${status.data.epoch.index}` : '-'}</span>

                    {status?.data?.epoch !== undefined &&
                        <Tooltip
                            label={`Next epoch change at ${new Date(status.data.epoch.endTime).toLocaleString()}`}
                            aria-label={'A tooltip'}
                            placement={'top'}
                            hasArrow
                            bg={'gray.700'}
                            color={'white'}
                        >
                            <InfoIcon boxSize={4} color={'gray.600'} ml={2}/>
                        </Tooltip>
                    }
                </div>
            </div>

            <div className={`NetworkStatus__InfoItem ${status?.loading ? 'NetworkStatus__InfoItem--Loading' : ''}`}>
                <Flex mr={6}>
                  <div className={'NetworkStatus__Title'}>Network:</div>
                  <div className={'NetworkStatus__Value'}>
                      <span>{status?.data?.network !== undefined ? `${status.data.network}` : 'n/a'}</span>

                      <Tooltip
                          label={`${networkStatus
                              ? 'Network appears operational'
                              : 'Chain propagation degraded'
                          }`}
                          aria-label={'Network status'}
                          placement={'top'}
                          hasArrow
                          bg={'gray.700'}
                          color={'white'}
                      >
                          {NetworkStatusIcon}
                      </Tooltip>
                  </div>
                </Flex>
                <Flex>
                  <div className={'NetworkStatus__Title NetworkStatus__Title--Api'}>API:</div>
                  <div className={'NetworkStatus__Value'}>
                      <Tooltip
                          label={`${networkStatus
                              ? 'API appears operational'
                              : 'API works intermittently'
                          }`}
                          aria-label={'Network status'}
                          placement={'top'}
                          hasArrow
                          bg={'gray.700'}
                          color={'white'}
                      >
                          {ApiStatusIcon}
                      </Tooltip>
                  </div>
                </Flex>
            </div>

            <div className={`NetworkStatus__InfoItem ${status?.loading ? 'NetworkStatus__InfoItem--Loading' : ''}`}>
                <div className={'NetworkStatus__Title'}>Latest block:</div>

                {status?.data?.latestBlock?.header !== undefined
                  ? <div className={'NetworkStatus__Value'}>
                        <Link href={`/block/${status.data.latestBlock.header.hash}`}>
                            #{status.data.latestBlock.header.height}, {getLastBlocktimeString()}
                        </Link>
                    </div>
                  : <div className={'NetworkStatus__Value'}>n/a</div>}
            </div>
        </Container>
  )
}

export default NetworkStatus
