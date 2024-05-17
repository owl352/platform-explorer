import { WarningTwoIcon } from '@chakra-ui/icons'
import { Flex } from '@chakra-ui/react'

function ErrorMessageBlock ({ w = '100%', h = '100%' }) {
  return (
    <Flex
      flexGrow={1}
      w={w}
      h={h}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      opacity={0.5}
    >
      <div><WarningTwoIcon color={'#ddd'} mr={2} mt={-1}/>Error loading data</div>
    </Flex>
  )
}

export {
  ErrorMessageBlock
}
