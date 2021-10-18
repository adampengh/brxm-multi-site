/*
 * Copyright 2020 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FormEvent } from "react";
import {
  FacetFieldFilterInput,
  FacetResultFragment,
  FacetResultFragment_fields,
  FacetResultFragment_fields_values,
} from "@bloomreach/connector-components-react";

import './FacetList.scss';

interface FacetListProps {
  facets?: FacetResultFragment;
  facetFieldFilters?: FacetFieldFilterInput[];
  setFacetFieldFilters: React.Dispatch<React.SetStateAction<FacetFieldFilterInput[] | undefined>>;
}

export default function FacetList(props: FacetListProps) {
  const { facets, facetFieldFilters, setFacetFieldFilters } = props;
  if (!facets?.fields) {
    return (
      <div className="category-wrapper widget-categories"><h4>Facet navigation not available</h4></div>
    );
  }

  const facetSelected = (facetField: FacetResultFragment_fields, facetValue: FacetResultFragment_fields_values): boolean => {
    return facetFieldFilters?.find((facet) => facet.id === facetField.id)?.values.includes(facetValue.id) ?? false;
  };

  const removeFacetFilter = (event: FormEvent, facetField: FacetResultFragment_fields, facetValue: FacetResultFragment_fields_values) => {
    event.preventDefault();
    if (!facetFieldFilters) {
      return;
    }
    const newFacetFieldFilters: FacetFieldFilterInput[] = facetFieldFilters.filter((facet) => facet.id !== facetField.id);
    const facet = facetFieldFilters?.find((facet) => facet.id === facetField.id);
    if (facet) {
      const values = facet.values.filter((value) => value !== facetValue.id);
      if (values.length) {
        newFacetFieldFilters.push({ values, id: facet.id });
      }
    }
    setFacetFieldFilters(newFacetFieldFilters);
  }

  const addFacetFilter = (event: FormEvent, facetField: FacetResultFragment_fields, facetValue: FacetResultFragment_fields_values) => {
    event.preventDefault();
    const newFacetFieldFilters: FacetFieldFilterInput[] = [...(facetFieldFilters ?? [])];
    const facet = newFacetFieldFilters.find((facet) => facet.id === facetField.id);
    if (facet && !facet.values.includes(facetValue.id)) {
      facet.values = [...facet.values, facetValue.id];
    } else {
      newFacetFieldFilters.push({ id: facetField.id, values: [facetValue.id] });
    }
    setFacetFieldFilters(newFacetFieldFilters);
  }

  return (
    <>
      <div className="accordion" id="accordionExample">
        {facets.fields.map((facet, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={`heading${index + 1}`}>
              <button className="accordion-button text-uppercase" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index + 1}`} aria-expanded="true" aria-controls="collapseOne">
                {facet?.name}
              </button>
            </h2>
            <div id={`collapse${index + 1}`} className={`accordion-collapse collapse ${index < 3 ? 'show' : ''}`} aria-labelledby="headingOne">
              <div className="accordion-body">
                <ul className="category-wrapper widget-categories list-unstyled">
                  {facet!.values
                    // .filter((value, index) => index < 10)
                    .map((value, index) => (
                      <li key={index}>
                        {facetSelected(facet!, value!) ?
                          (<button className="category" onClick={(event) => removeFacetFilter(event, facet!, value!)}>
                            <span className="close text-danger" aria-hidden="true">&times;</span>
                            <span>{ value!.name }</span>
                            <span className="d-inline-block ml-1">({value!.count})</span>
                          </button>)
                        :
                          (<button className="category" onClick={(event) => addFacetFilter(event, facet!, value!)}>
                            <span>{value!.name}</span>
                            <span className="d-inline-block ml-1 small">({value!.count})</span>
                          </button>)}
                      </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
