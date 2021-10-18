package com.myproject.components;

import org.hippoecm.hst.component.support.bean.BaseHstComponent;
import org.hippoecm.hst.content.beans.query.HstQuery;
import org.hippoecm.hst.content.beans.query.HstQueryResult;
import org.hippoecm.hst.content.beans.query.builder.HstQueryBuilder;
import org.hippoecm.hst.content.beans.query.exceptions.QueryException;
import org.hippoecm.hst.content.beans.standard.HippoBean;
import org.hippoecm.hst.content.beans.standard.HippoBeanIterator;
import org.hippoecm.hst.core.component.HstComponentException;
import org.hippoecm.hst.core.component.HstRequest;
import org.hippoecm.hst.core.component.HstResponse;
import org.hippoecm.hst.core.request.HstRequestContext;
import org.hippoecm.hst.util.SearchInputParsingUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.hippoecm.hst.content.beans.query.builder.ConstraintBuilder.constraint;


public class ProductDetailCustomContent extends BaseHstComponent {

    private static Logger log = LoggerFactory.getLogger(ProductDetailCustomContent.class);
    private static String FOLDER_NAME = "product-detail-custom-content";
    private static String DOCUMENT_TYPE = "myproject:ProductDetailCustomContent";

    @Override
    public void doBeforeRender(final HstRequest request, final HstResponse response) throws HstComponentException {

        try {
            HstRequestContext requestContext = request.getRequestContext();

            // Get the productId from component parameters
            String productId = getComponentParameter("productId");
            productId = SearchInputParsingUtils.parse(productId, false);
            log.debug("productId: {}", productId);

            // See if there is a document with name equal to the productId
            HippoBean document = requestContext.getSiteContentBaseBean().getBean(FOLDER_NAME + "/" + productId);
            log.debug("document: {}", document);

            if (document != null) {
                log.debug("document: {}", document);
                request.setModel("ProductDetailCustomContent", document);
            }

        } catch (HstComponentException e) {
            log.error("The Product Detail Custom Content query failed", e);
        }
    }
}
