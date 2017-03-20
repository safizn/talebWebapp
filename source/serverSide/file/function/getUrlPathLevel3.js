import getUrlPathAsArray from 'file/function/getUrlPathAsArray.js'

export default async (self) => {
    let context = self.context
    let pathArray = await getUrlPathAsArray(context)
    return pathArray[3]
}