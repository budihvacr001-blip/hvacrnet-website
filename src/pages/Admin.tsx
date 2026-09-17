import { categories, isProductPublished } from '../data/products'
import SEO from '../components/SEO'

const badge = (cls: string, text: string) => (
  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${cls}`}>{text}</span>
)

export default function Admin() {
  return (
    <>
      <SEO
        title="目录结构管理 | HVACR NET"
        description="后台目录结构总览"
        noindex
      />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">目录结构总览（后台）</h1>
        <p className="mb-6 text-sm text-gray-500">
          完整展示所有目录层级（含空目录）。前台仅展示含有发布产品的目录。
        </p>

        {categories.map((cat, i) => {
          const publishedCount = cat.products.filter((p) => isProductPublished(p)).length
          return (
            <div key={cat.id} className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
                <span className="font-mono text-sm font-semibold text-gray-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {cat.isOverview && badge('bg-purple-100 text-purple-700', 'Overview')}
                <span className="text-base font-semibold text-gray-900">{cat.name}</span>
                <span className="text-sm text-gray-500">({cat.id})</span>
                <span className="ml-auto">
                  {badge(
                    publishedCount >= 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
                    `${publishedCount} published / ${cat.products.length} total`
                  )}
                </span>
              </div>

              {cat.subCategories.map((sub, si) => {
                const subPublished = cat.products.filter(
                  (p) => isProductPublished(p) && p.subCategoryId === sub.id
                ).length
                const isContainer = !!(sub.subCategories && sub.subCategories.length > 0)
                return (
                  <div key={sub.id} className="border-b border-gray-100 px-4 py-2 pl-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-gray-400">{String(si + 1).padStart(2, '0')}</span>
                      {sub.isOverview && badge('bg-purple-100 text-purple-700', 'Overview')}
                      <span className="text-sm font-medium text-gray-800">{sub.name}</span>
                      <span className="text-xs text-gray-400">({sub.id})</span>
                      {isContainer && badge('bg-blue-100 text-blue-700', 'container')}
                      <span className="ml-auto text-xs text-gray-500">{subPublished} published</span>
                    </div>

                    {sub.subCategories && sub.subCategories.length > 0 && (
                      <div className="mt-1 pl-7">
                        {sub.subCategories.map((third, ti) => {
                          const thirdPublished = cat.products.filter(
                            (p) => isProductPublished(p) && p.thirdCategoryId === third.id
                          ).length
                          return (
                            <div key={third.id} className="flex flex-wrap items-center gap-3 py-1">
                              <span className="font-mono text-xs text-gray-400">{String(ti + 1).padStart(2, '0')}</span>
                              {third.isOverview && badge('bg-purple-100 text-purple-700', 'Overview')}
                              <span className="text-sm text-gray-700">{third.name}</span>
                              <span className="text-xs text-gray-400">({third.id})</span>
                              <span className="ml-auto">
                                {badge(
                                  thirdPublished >= 1 ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500',
                                  `${thirdPublished} published`
                                )}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}