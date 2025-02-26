import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

import { InformationCircleSolid } from "@medusajs/icons"
import { Tooltip, TooltipProvider } from "@medusajs/ui"

interface ExtendedStoreProduct extends HttpTypes.StoreProduct {
  mockSFC?: number
}

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: ExtendedStoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  const MOCK_SFC = 500
  product.mockSFC = MOCK_SFC

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          isFeatured={isFeatured}
        />
        <div className="flex flex-col txt-compact-medium justify-between">
          <div className="h-16">
            <Text
              className="text-ui-fg-subtle mb-6"
              data-testid="product-title"
            >
              {product.title}
            </Text>
          </div>
          <div className="flex items-center gap-x-2 mb-2 line-through">
            {`Full Course Fee: $${cheapestPrice?.calculated_price_number}`}
          </div>
          <div className="flex items-center gap-x-2 mb-2">
            {`SFC Balance: ($${product.mockSFC})`}
          </div>
          <TooltipProvider>
            <div className="flex flex-row">
              <div className="flex items-center gap-x-2 text-red-500">
                {"Course Fee (with SFC Offset):"}
                <Tooltip content="Note: The final course fees shown here represents the indicative course fee payable after offsets from your SkillsFuture Credits. Please check with the training provider on your eligibility for other grants and applicable GST on the payable course fees.">
                  <InformationCircleSolid />
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
          <div className="text-red-500">
            {`$${
              cheapestPrice?.calculated_price_number &&
              cheapestPrice?.calculated_price_number - product.mockSFC > 0
                ? cheapestPrice?.calculated_price_number - product.mockSFC
                : 0
            }`}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
