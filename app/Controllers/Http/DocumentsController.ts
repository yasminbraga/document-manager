import { Application } from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import authConfig from 'Config/auth'

export default class DocumentsController {
  public async index ({}: HttpContextContract) {
  }

  public async create({ view }: HttpContextContract) {
    return view.render('documents/create')
  }

  public async store({ request, response, session, auth }: HttpContextContract) {
    const documentData = request.only(['title', 'description', 'tags'])
    const documentFile = request.file('file')

    if (!documentFile) {
      session.flash('error', 'Pelo menos um arquivo')

      return response.redirect().back()
    }

    const pathUrl = `${Date.now()}-${documentFile.fileName}-${documentFile.extname}`

    await documentFile.move(Application.tmpPath('uploads'), {
      name: pathUrl,
    })

    const user = auth.user

    if (user) {
      const document = await user?.related('documents').create(documentData)
      await document.related('file').create({ pathUrl })
    }

    return {
      documentData,
      documentFile,
    }
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit({ view }: HttpContextContract) {
    return view.render('documents/edit')
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
