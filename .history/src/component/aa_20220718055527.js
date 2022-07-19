<div className="question">
                        <img className="doctor__img" src={roboDoc} alt="" />
                        <p>{item.question}</p>
                      </div>
                      <div className="action">
                        <button
                          className={
                            index + 1 === chatArr.length
                              ? "answer"
                              : "alreadyAnswer"
                          }
                          key={index}
                        >
                          {item.emoji_image.length > 0 ? (
                            <>
                              {setEmoji(
                                item.option,
                                item.answer,
                                item.emoji_image
                              )}
                              {/* {item.option.map((opt,index) => 
                                   <img src={opt === item.answer ? item.emoji_image[index] : ''} width="40" height="40" />
                              )} */}
                            </>
                          ) : (
                            <>
                              {Array.isArray(item.answer)
                                ? item.answer[0]
                                : item.answer}
                            </>
                          )}

                          {index + 1 === chatArr.length && (
                            <i
                              onClick={() => handleEdit(item)}
                              className="bi bi-pencil-square edit-icon"
                            ></i>
                          )}
                        </button>
                      </div>
                      {item.type !== "rpt" &&
                        item.type !== "score" &&
                        item.type !== "Consent" && (
                          <div className="in">
                            <div className="question">
                              {/* <img className="doctor__img" src={roboDoc} alt="" /> */}
                              {/* <p className="random-text">
                            {JSON.parse(localStorage.getItem("qst")).length -
                              1 ===
                            index
                              ? `Report generating....`
                              : item.rply}
                          </p> */}
                              {loading && index + 1 === chatArr.length && (
                                <>
                                  <img
                                    className="doctor__img2"
                                    src={roboDoc}
                                    alt=""
                                  />
                                  <Loading />
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      {/* report */}
                      {item.type === "rpt" && (
                        <div className="card">
                          <div className="card-details">
                            {/* <div className="name">{name}</div> */}

                            {/* <div className="card-about">
                              <div className="item">
                                <span className="value">{age}</span>
                                <span className="label">Age</span>
                              </div>
                              <div className="item">
                                <span className="value">{weight} kg </span>
                                <span className="label">Weight</span>
                              </div>
                              <div className="item">
                                <span className="value">{height} cm</span>
                                <span className="label">Height</span>
                              </div>
                            </div> */}
                            <div className="skills">
                              {Array.isArray(item.rply) ? (
                                <>
                                  {item.rply.map((rply) => (
                                    <p className="value">{rply}</p>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <p className="value">{item.rply}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {item.type === "score" && (
                        <div
                          className="score"
                          id={
                            item.scoreType === "high"
                              ? "score-high"
                              : item.scoreType === "mild"
                              ? "score-mild"
                              : item.scoreType === "low"
                              ? "score-low"
                              : null
                          }
                        >
                          <div
                            id={
                              item.scoreType === "high"
                                ? "outer-circle-high"
                                : item.scoreType === "mild"
                                ? "outer-circle-mild"
                                : item.scoreType === "low"
                                ? "outer-circle-low"
                                : null
                            }
                          >
                            <span
                              className="percentage"
                              id={
                                item.scoreType === "high"
                                  ? "percentage-high"
                                  : item.scoreType === "mild"
                                  ? "percentage-mild"
                                  : item.scoreType === "low"
                                  ? "percentage-low"
                                  : null
                              }
                            >
                              {item.rply}%
                            </span>
                          </div>
                          <div className="scoreMessage">
                            <p>
                              Dear {firstname},Thank you for initiating an
                              assesssment.I understand that you spend {time}{" "}
                              doing {activity} activity.This results in pain{" "}
                              {part}
                            </p>
                            <p>
                              We'll Like to help you with it and for muscle
                              Strengthening and conditioning
                            </p>
                          </div>
                        </div>
                      )}