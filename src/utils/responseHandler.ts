import { AxiosResponse } from 'axios'
import { IApiResponse } from '../../types/index.d.js'

const displayTexts: Record<string, string> = {
  'Invalid username.': 'I don\'t see the player with that username, maybe try again.. or If you\'re searching using ID, Try type " id" after your targetted user id!',
  'Invalid user ID.': "I don't see the player with that id, maybe try again.. or If you're searching using username, Try type \" username\" after your targetted user s' username!"
}

export class responseHandler {
  /**
 * Check Error
 * @param { AxiosResponse } The response from Axios request.
 * @returns { IApiResponse }
 */
  public static checkError (response: AxiosResponse) {
    const result: IApiResponse = {
      hasError: false,
      statusCode: 0,
      displayText: 'Unknown error.',
      actualError: 'Unknown error.'
    }

    result.statusCode = response.status

    if (response.status >= 500) {
      result.hasError = true
      result.displayText = 'An unexpected error happen while sending request to Polytoria API. Please try again in a few minutes.'
      result.actualError = 'Erro da API'
    } else if (response.status === 404) {
      result.hasError = true
      result.displayText = "Couldn't find it on Polytoria"
      result.actualError = 'Not found'
    } else if (response.data.Success === false) {
      result.hasError = true
      result.actualError = response.data.Errors[0]

      if (displayTexts[result.actualError]) {
        result.displayText = displayTexts[result.actualError]
      }
    }

    return result
  }
}
